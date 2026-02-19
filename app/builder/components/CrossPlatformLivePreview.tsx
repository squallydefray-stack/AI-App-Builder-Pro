//
//  CrossPlatformLivePreview.tsx
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/17/26.
//


"use client"

import React, { useRef, useState, useEffect, useCallback } from "react"
import {
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  MeasuringStrategy,
} from "@dnd-kit/core"
import { AnimatePresence, motion } from "framer-motion"
import { useBuilderStore } from "../state/builderStore"
import NodeRenderer from "./NodeRenderer"
import MultiSelectResizer from "./MultiSelectResizer"
import ExportFeedbackPanel from "./ExportFeedbackPanel"
import { BuilderComponent, BuilderSchema } from "@lib/exporter/schema"
import { applyConstraints } from "@/lib/utils/constraintSolver"
import { reflowAutoLayout, expandRepeaters } from "@/lib/utils/autoLayoutEngine"
import { convertToNextTailwind, convertToReactNative } from "@/lib/exporter/codeGenerator"

interface SnapLine { x?: number; y?: number }
interface SpacingHint { x?: number; y?: number; value: number }
const SNAP_THRESHOLD = 12

export default function CrossPlatformLivePreview() {
  const containerRef = useRef<HTMLDivElement>(null)
  const {
    pages,
    activePageId,
    selectedIds,
    setSelection,
    toggleSelect,
    updateMultipleComponents,
    zoom,
  } = useBuilderStore()
  const page = pages.find(p => p.id === activePageId)
  const [snapLines, setSnapLines] = useState<SnapLine[]>([])
  const [spacingHints, setSpacingHints] = useState<SpacingHint[]>([])
  const [draggingIds, setDraggingIds] = useState<string[]>([])
  const [platform, setPlatform] = useState<"nextjs" | "reactnative">("nextjs")
  const [liveExportCode, setLiveExportCode] = useState<string>("")

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  if (!page) return <div>No page selected</div>

  const handleClick = (id: string, e: React.MouseEvent) => {
    if (e.shiftKey) toggleSelect(id)
    else setSelection([id])
  }

  // -------------------------
  // Drag Move + Snap + AutoLayout
  // -------------------------
  const handleDragMove = useCallback(
    (event: DragMoveEvent) => {
      if (!containerRef.current) return
      const draggedEl = document.getElementById(event.active.id)
      if (!draggedEl) return

      const multiSelected = selectedIds.includes(event.active.id) ? selectedIds : [event.active.id]
      setDraggingIds(multiSelected)

      const lines: SnapLine[] = []
      const hints: SpacingHint[] = []

      const allEls = Array.from(containerRef.current.querySelectorAll<HTMLElement>("[data-builder-id]"))
      multiSelected.forEach((id) => {
        const elA = document.getElementById(id)
        if (!elA) return
        allEls.forEach((elB) => {
          if (multiSelected.includes(elB.dataset.builderId!)) return
          const rectA = elA.getBoundingClientRect()
          const rectB = elB.getBoundingClientRect()
          if (Math.abs(rectA.left - rectB.left) < SNAP_THRESHOLD) lines.push({ x: rectB.left })
          if (Math.abs(rectA.top - rectB.top) < SNAP_THRESHOLD) lines.push({ y: rectB.top })
          const hSpacing = Math.abs(rectB.left - rectA.right)
          const vSpacing = Math.abs(rectB.top - rectA.bottom)
          if (hSpacing > 0 && hSpacing < 200) hints.push({ x: rectA.right, value: hSpacing })
          if (vSpacing > 0 && vSpacing < 200) hints.push({ y: rectA.bottom, value: vSpacing })
        })
      })

      setSnapLines(lines)
      setSpacingHints(hints)

      const reflowed = reflowAutoLayout([...page.components], containerRef.current.clientWidth, containerRef.current.clientHeight)
      updateMultipleComponents(reflowed)
    },
    [page.components, selectedIds, updateMultipleComponents]
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setSnapLines([])
      setSpacingHints([])
      setDraggingIds([])
      const multiSelected = selectedIds.includes(event.active.id) ? selectedIds : [event.active.id]

      const moveComponents = (components: BuilderComponent[]): BuilderComponent[] => {
        let moved: BuilderComponent[] = []
        const filtered = components.filter((c) => {
          if (multiSelected.includes(c.id)) {
            moved.push(c)
            return false
          }
          if (c.children) c.children = moveComponents(c.children)
          return true
        })
        return [...filtered, ...moved]
      }

      const reflowed = reflowAutoLayout(moveComponents([...page.components]), containerRef.current!.clientWidth, containerRef.current!.clientHeight)
      updateMultipleComponents(reflowed)
    },
    [page.components, selectedIds, updateMultipleComponents]
  )

  // -------------------------
  // Live Export Code Generation per Platform
  // -------------------------
  useEffect(() => {
    const code = platform === "nextjs"
      ? convertToNextTailwind({ pages } as BuilderSchema)
      : convertToReactNative({ pages } as BuilderSchema)
    setLiveExportCode(code)
  }, [pages, platform])

  // -------------------------
  // Render Node recursively
  // -------------------------
  const renderComponent = useCallback(
    (comp: BuilderComponent) => {
      const isSelected = selectedIds.includes(comp.id)
      const constrained = applyConstraints(comp, containerRef.current?.clientWidth || 800, containerRef.current?.clientHeight || 600)
      return (
        <div
          key={comp.id}
          data-builder-id={comp.id}
          onClick={(e) => { e.stopPropagation(); handleClick(comp.id, e) }}
          style={{
            width: constrained.width,
            height: constrained.height,
            position: "relative",
            transition: "all 0.1s ease-in-out",
            boxShadow: isSelected ? "0 0 0 2px #3b82f6" : "none",
          }}
        >
          <NodeRenderer component={comp} parentWidth={constrained.width} parentHeight={constrained.height} platform={platform} />
          {comp.children?.map(renderComponent)}
        </div>
      )
    },
    [selectedIds, platform]
  )

  return (
    <div className="w-full h-full flex flex-col items-center overflow-hidden p-2 gap-2">
      {/* Platform Toggle */}
      <div className="flex gap-2 mb-2">
        <button className={`px-3 py-1 rounded ${platform==="nextjs" ? "bg-blue-500 text-white" : "bg-gray-200"}`} onClick={()=>setPlatform("nextjs")}>Next.js / Tailwind</button>
        <button className={`px-3 py-1 rounded ${platform==="reactnative" ? "bg-green-500 text-white" : "bg-gray-200"}`} onClick={()=>setPlatform("reactnative")}>React Native</button>
      </div>

      {/* Interactive Canvas */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
      >
        <div className="w-full flex justify-center overflow-auto p-2 relative">
          <div style={{ transform: `scale(${zoom})`, transformOrigin: "top center" }} className="relative w-full">
            <div ref={containerRef} className="bg-white border rounded-2xl p-4 relative min-h-[500px] flex flex-col gap-2">
              <AnimatePresence>
                {page.components.map(renderComponent)}
              </AnimatePresence>

              {/* Snap Lines */}
              {snapLines.map((line, i) => (
                <motion.div
                  key={i}
                  className="absolute bg-blue-400 pointer-events-none"
                  style={{
                    top: line.y ?? 0,
                    left: line.x ?? 0,
                    width: line.x !== undefined ? 1 : "100%",
                    height: line.y !== undefined ? 1 : "100%",
                  }}
                />
              ))}

              {/* Spacing Hints */}
              {spacingHints.map((hint, i) => (
                <motion.div
                  key={i}
                  className="absolute text-xs text-gray-600 bg-white px-1 rounded shadow pointer-events-none select-none"
                  style={{
                    top: hint.y ?? 0,
                    left: hint.x ?? 0,
                  }}
                >
                  {hint.value}px
                </motion.div>
              ))}

              {/* Multi-Select Resizer */}
              {selectedIds.length > 0 && <MultiSelectResizer selectedIds={selectedIds} parentRef={containerRef} />}
            </div>
          </div>
        </div>
      </DndContext>

      {/* Export Feedback Panel */}
      <ExportFeedbackPanel liveCode={liveExportCode} />
    </div>
  )
}

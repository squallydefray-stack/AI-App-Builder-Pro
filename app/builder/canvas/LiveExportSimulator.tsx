//
//  LiveExportSimulator.tsx
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/17/26.
//


"use client"

import React, { useRef, useState, useCallback, useEffect } from "react"
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
import { smartAlign } from "@/lib/utils/alignmentEngine"
import { convertToNextTailwind } from "@/lib/exporter/codeGenerator"

interface SnapLine { x?: number; y?: number }
interface SpacingHint { x?: number; y?: number; value: number }
const SNAP_THRESHOLD = 12

// -------------------------
// Expand Repeaters for Live Preview
// -------------------------
function expandRepeaters(components: BuilderComponent[]): BuilderComponent[] {
  return components.flatMap(c => {
    if (c.type === "Repeater" && c.props.data?.length) {
      return c.props.data.map((item: any, idx: number) => ({
        ...c.children![0], // template child
        id: `${c.id}-item-${idx}`,
        props: { ...c.children![0].props, base: { ...(c.children![0].props.base || {}), ...item } },
      }))
    } else if (c.children?.length) {
      return [{ ...c, children: expandRepeaters(c.children) }]
    } else {
      return [c]
    }
  })
}

// -------------------------
// AutoLayout Reflow with Fill/Hug
// -------------------------
function reflowAutoLayout(components: BuilderComponent[], parentWidth: number, parentHeight: number): BuilderComponent[] {
  return components.map(c => {
    if (c.layout?.autoLayout?.enabled && c.children?.length) {
      const auto = c.layout.autoLayout
      let offset = 0
      c.children = expandRepeaters(c.children).map(child => {
        const constrained = applyConstraints(child, parentWidth, parentHeight)
        if (auto.direction === "row") {
          child.props.base = {
            ...child.props.base,
            x: offset,
            y: 0,
            width: auto.fillChildren ? "fill" : constrained.width,
            height: auto.hugChildren ? "hug" : constrained.height,
          }
          offset += (typeof child.props.base.width === "number" ? child.props.base.width : 100) + (auto.gap || 0)
        } else {
          child.props.base = {
            ...child.props.base,
            x: 0,
            y: offset,
            width: auto.hugChildren ? "hug" : constrained.width,
            height: auto.fillChildren ? "fill" : constrained.height,
          }
          offset += (typeof child.props.base.height === "number" ? child.props.base.height : 50) + (auto.gap || 0)
        }
        if (child.children?.length) child.children = reflowAutoLayout(child.children, constrained.width, constrained.height)
        return child
      })
    }
    return c
  })
}

// -------------------------
// Main Live Export Simulator
// -------------------------
export default function LiveExportSimulator() {
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
  const [liveExportCode, setLiveExportCode] = useState<string>("")

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  if (!page) return <div>No page selected</div>

  const handleClick = (id: string, e: React.MouseEvent) => {
    if (e.shiftKey) toggleSelect(id)
    else setSelection([id])
  }

  // -------------------------
  // Drag Move: Snaps + Spacing + Live Reflow
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

      // Live Reflow AutoLayout + Repeaters
      const reflowed = reflowAutoLayout([...page.components], containerRef.current.clientWidth, containerRef.current.clientHeight)
      updateMultipleComponents(reflowed)
    },
    [page.components, selectedIds, updateMultipleComponents]
  )

  // -------------------------
  // Drag End: Commit Moves + Reflow
  // -------------------------
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
  // Live Export Code Generation
  // -------------------------
  useEffect(() => {
    const code = convertToNextTailwind({ pages } as BuilderSchema)
    setLiveExportCode(code)
  }, [pages])

  // -------------------------
  // Render Components
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
          <NodeRenderer component={comp} parentWidth={constrained.width} parentHeight={constrained.height} />
          {comp.children?.map(renderComponent)}
        </div>
      )
    },
    [selectedIds]
  )

  return (
    <div className="w-full h-full flex flex-col items-center overflow-hidden p-2">
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

      {/* Export Feedback Panel: Live Export + GitHub Push */}
      <ExportFeedbackPanel liveCode={liveExportCode} />
    </div>
  )
}

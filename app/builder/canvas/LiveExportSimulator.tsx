// app/builder/canvas/LiveExportSimulator.tsx
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
import { AnimatePresence } from "framer-motion"
import { useBuilderStore } from "@/builder/state/builderStore"
import { NodeRenderer } from "@/builder/canvas/NodeRenderer"
import MultiSelectResizer from "@/builder/components/MultiSelectResizer"
import ExportFeedbackPanel from "@/builder/canvas/ExportFeedbackPanel"
import { BuilderComponent, BuilderSchema, Breakpoint } from "@lib/exporter/schema"
import { applyConstraints } from "@lib/layout/autoLayout"
import { reflowAutoLayout, expandRepeaters } from "@lib/utils/autoLayoutEngine"
import { convertToNextTailwind, convertToReactNative } from "@lib/exporter/codeGenerator"

interface SnapLine { x?: number; y?: number }
interface SpacingHint { x?: number; y?: number; value: number }
const SNAP_THRESHOLD = 12

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

  const page = pages.find((p) => p.id === activePageId)
  const [snapLines, setSnapLines] = useState<SnapLine[]>([])
  const [spacingHints, setSpacingHints] = useState<SpacingHint[]>([])
  const [draggingIds, setDraggingIds] = useState<string[]>([])
  const [platform, setPlatform] = useState<"nextjs" | "reactnative">("nextjs")
  const [liveExportCode, setLiveExportCode] = useState<any>({})

  if (!page) return <div>No page selected</div>

  const breakpoint: Breakpoint = "base"

  const handleClick = (id: string, e: React.MouseEvent) => {
    if (e.shiftKey) toggleSelect(id)
    else setSelection([id])
  }

  // -------------------------
  // DND Kit sensors & helpers
  // -------------------------
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )
  const collisionDetection = closestCorners
    const measuring = {
      droppable: {
        strategy: MeasuringStrategy.Always,
      },
    }
  // -------------------------
  // Drag Move + Snap + AutoLayout
  // -------------------------
  const handleDragMove = useCallback(
    (event: DragMoveEvent) => {
      if (!containerRef.current) return
      const activeId = String(event.active.id)
      const multiSelected = selectedIds.includes(activeId) ? selectedIds : [activeId]

      setDraggingIds(multiSelected)

      const lines: SnapLine[] = []
      const hints: SpacingHint[] = []

      const allEls = Array.from(
        containerRef.current.querySelectorAll<HTMLElement>("[data-builder-id]")
      )

      multiSelected.forEach((id) => {
        const elA = document.getElementById(id)
        if (!elA) return

        allEls.forEach((elB) => {
          if (multiSelected.includes(elB.dataset.builderId!)) return

          const rectA = elA.getBoundingClientRect()
          const rectB = elB.getBoundingClientRect()

          if (Math.abs(rectA.left - rectB.left) < SNAP_THRESHOLD)
            lines.push({ x: rectB.left })
          if (Math.abs(rectA.top - rectB.top) < SNAP_THRESHOLD)
            lines.push({ y: rectB.top })

          const hSpacing = Math.abs(rectB.left - rectA.right)
          const vSpacing = Math.abs(rectB.top - rectA.bottom)

          if (hSpacing > 0 && hSpacing < 200) hints.push({ x: rectA.right, value: hSpacing })
          if (vSpacing > 0 && vSpacing < 200) hints.push({ y: rectA.bottom, value: vSpacing })
        })
      })

      setSnapLines(lines)
      setSpacingHints(hints)

      const reflowed = reflowAutoLayout(
        expandRepeaters([...page.components]),
        containerRef.current.clientWidth,
        containerRef.current.clientHeight,
        breakpoint
      )

      updateMultipleComponents(reflowed)
    },
    [page.components, selectedIds, updateMultipleComponents]
  )

  // -------------------------
  // Drag End
  // -------------------------
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      if (!containerRef.current) return

      setSnapLines([])
      setSpacingHints([])
      setDraggingIds([])

      const activeId = String(event.active.id)
      const multiSelected = selectedIds.includes(activeId) ? selectedIds : [activeId]

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

      const reflowed = reflowAutoLayout(
        moveComponents(expandRepeaters([...page.components])),
        containerRef.current.clientWidth,
        containerRef.current.clientHeight,
        breakpoint
      )

      updateMultipleComponents(reflowed)
    },
    [page.components, selectedIds, updateMultipleComponents]
  )

  // -------------------------
  // Live Export Code
  // -------------------------
  useEffect(() => {
    const schema: BuilderSchema = {
      id: "generated",
      name: "GeneratedApp",
      pages,
      components: [],
    }

    const files =
      platform === "nextjs"
        ? convertToNextTailwind(pages, { appName: "GeneratedApp" })
        : convertToReactNative(schema)

    setLiveExportCode(files)
  }, [pages, platform])

  // -------------------------
  // Render Component recursively
  // -------------------------
  const renderComponent = useCallback(
    (comp: BuilderComponent) => {
      const isSelected = selectedIds.includes(comp.id)
      const layout = applyConstraints(
        comp,
        containerRef.current?.clientWidth ?? 800,
        containerRef.current?.clientHeight ?? 600,
        breakpoint
      )
      const baseProps = comp.propsPerBreakpoint?.[breakpoint] || {}

      return (
        <div
          key={comp.id}
          data-builder-id={comp.id}
          onClick={(e) => {
            e.stopPropagation()
            handleClick(comp.id, e)
          }}
          style={{
            position: "relative",
            width: layout.width,
            height: layout.height,
            transition: "all 0.1s ease-in-out",
            boxShadow: isSelected ? "0 0 0 2px #3b82f6" : "none",
          }}
        >
          <NodeRenderer component={comp} animate />
          {comp.children?.map(renderComponent)}
        </div>
      )
    },
    [selectedIds]
  )

  return (
    <div className="w-full h-full flex flex-col items-center overflow-hidden p-2 gap-2">
      {/* Platform Toggle */}
      <div className="flex gap-2 mb-2">
        <button
          className={`px-3 py-1 rounded ${
            platform === "nextjs" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setPlatform("nextjs")}
        >
          Next.js / Tailwind
        </button>

        <button
          className={`px-3 py-1 rounded ${
            platform === "reactnative" ? "bg-green-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setPlatform("reactnative")}
        >
          React Native
        </button>
      </div>

      {/* Canvas */}
      <DndContext
        sensors={sensors}
        collisionDetection={collisionDetection}
        measuring={measuring}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
      >
        <div className="w-full flex justify-center overflow-auto p-2 relative">
          <div
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "top center",
            }}
            className="relative w-full"
          >
            <div
              ref={containerRef}
              className="bg-white border rounded-2xl p-4 relative min-h-[500px] flex flex-col gap-2"
            >
              <AnimatePresence>
                {page.components.map(renderComponent)}
              </AnimatePresence>

              {selectedIds.length > 0 && (
                <MultiSelectResizer selectedIds={selectedIds} parentRef={containerRef} />
              )}
            </div>
          </div>
        </div>
      </DndContext>

      <ExportFeedbackPanel liveCode={liveExportCode} />
    </div>
  )
}

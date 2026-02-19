//
//  InteractiveExportSimulator.tsx
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/17/26.
//


"use client"

import React, { useState, useMemo, useCallback } from "react"
import { useBuilderStore } from "../state/builderStore"
import NodeRenderer from "../canvas/NodeRenderer"
import ExportPage from "./ExportPage"
import { BuilderComponent } from "@lib/exporter/schema"
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { arrayMove } from "@dnd-kit/sortable"
import ResizeHandles from "../canvas/ResizeHandles"

// ===============================
// Helper: AutoLayout & Fill/Hug Feedback
// ===============================
const getFillHugStyles = (component: BuilderComponent) => {
  const styles: Record<string, string> = {}
  if (component.layout?.widthMode === "fill") styles.border = "2px dashed green"
  if (component.layout?.heightMode === "fill") styles.border = "2px dashed green"
  if (component.layout?.widthMode === "hug") styles.border = "2px dashed blue"
  if (component.layout?.heightMode === "hug") styles.border = "2px dashed blue"
  return styles
}

// ===============================
// Main Interactive Export Simulator
// ===============================
export default function InteractiveExportSimulator() {
  const pages = useBuilderStore((s) => s.pages)
  const activePageId = useBuilderStore((s) => s.activePageId)
  const selectComponent = useBuilderStore((s) => s.selectSingle)
  const selectedIds = useBuilderStore((s) => s.selectedIds)
  const [platform, setPlatform] = useState<"web" | "react-native">("web")
  const [canvasScale, setCanvasScale] = useState<number>(1)
  const page = pages.find((p) => p.id === activePageId)

  const sensors = useSensors(useSensor(PointerSensor))

  if (!page) return <div>No page selected</div>

  // ===============================
  // Drag End Handler for DnD
  // ===============================
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return
    const indexFrom = page.components.findIndex((c) => c.id === active.id)
    const indexTo = page.components.findIndex((c) => c.id === over.id)
    if (indexFrom === -1 || indexTo === -1 || indexFrom === indexTo) return
    const newOrder = arrayMove([...page.components], indexFrom, indexTo)
    useBuilderStore.setState({
      pages: pages.map((p) =>
        p.id === page.id ? { ...p, components: newOrder } : p
      ),
    })
  }, [page, pages])

  // ===============================
  // Render recursive nodes with fill/hug feedback & live resize handles
  // ===============================
  const renderNode = (component: BuilderComponent) => {
    const isSelected = selectedIds.includes(component.id)
    const fillHugStyle = getFillHugStyles(component)

    return (
      <div
        key={component.id}
        style={{ ...fillHugStyle, transition: "all 0.15s" }}
        onClick={(e) => {
          e.stopPropagation()
          selectComponent(component.id)
        }}
      >
        <NodeRenderer component={component} />
        {isSelected && <ResizeHandles id={component.id} />}
        {component.children && component.children.map(renderNode)}
      </div>
    )
  }

  // ===============================
  // Repeaters & Data-bound Components (mocked for live preview)
  // ===============================
  const renderRepeater = (component: BuilderComponent) => {
    if (component.type === "Repeater" && component.props?.items) {
      return component.props.items.map((item: any, idx: number) => {
        const clone: BuilderComponent = {
          ...component.children[0],
          id: `${component.children[0].id}-${idx}`,
          props: { ...component.children[0].props, base: item },
        }
        return renderNode(clone)
      })
    }
    return renderNode(component)
  }

  return (
    <div className="flex flex-col md:flex-row w-full h-full">
      {/* Left Panel: Controls */}
      <div className="md:w-1/4 p-4 border-r h-full space-y-4">
        <h2 className="text-xl font-bold">Interactive Export Simulator</h2>

        <div className="space-y-2">
          <label>Platform:</label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value as "web" | "react-native")}
            className="border px-2 py-1 rounded w-full"
          >
            <option value="web">Next.js (Web)</option>
            <option value="react-native">React Native</option>
          </select>
        </div>

        <div className="space-y-2">
          <label>Canvas Scale:</label>
          <input
            type="range"
            min={0.25}
            max={2}
            step={0.05}
            value={canvasScale}
            onChange={(e) => setCanvasScale(parseFloat(e.target.value))}
            className="w-full"
          />
          <div>{Math.round(canvasScale * 100)}%</div>
        </div>

        <div className="space-y-2">
          <strong>Selected Components:</strong>
          <ul>
            {selectedIds.map((id) => (
              <li key={id}>{id}</li>
            ))}
          </ul>
        </div>

        <div className="mt-4">
          {/* Embed Export Page for live export */}
          <ExportPage />
        </div>
      </div>

      {/* Right Panel: Interactive Canvas */}
      <div
        className="md:w-3/4 p-4 overflow-auto relative bg-gray-50"
        style={{
          transform: `scale(${canvasScale})`,
          transformOrigin: "top left",
          minHeight: "600px",
        }}
      >
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <SortableContext items={page.components.map((c) => c.id)} strategy={verticalListSortingStrategy}>
            {page.components.map(renderRepeater)}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  )
}

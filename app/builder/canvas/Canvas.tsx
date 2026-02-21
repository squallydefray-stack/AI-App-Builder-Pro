// app/builder/canvas/Canvas.tsx
"use client"

import React, { useState } from "react"
import { BuilderSchema } from "@lib/exporter/schema"
import { NodeRenderer } from "@canvas/NodeRenderer"
import { useBuilderStore } from "@state/builderStore"
import { DndContext, PointerSensor, useSensor, useSensors, DragOverlay } from "@dnd-kit/core"
import { getSnapOffset } from "@canvas/GridSnapping"

type BuilderCanvasProps = {
  builderSchema: BuilderSchema
}

export const BuilderCanvas: React.FC<BuilderCanvasProps> = ({ builderSchema }) => {
  const { pages, activePageId, activeBreakpoint } = useBuilderStore()
  const [draggingComponent, setDraggingComponent] = useState<null | any>(null)
  const sensors = useSensors(useSensor(PointerSensor))

  const activePages = builderSchema?.pages || pages
  const activePage = activePages.find((p) => p.id === activePageId) || activePages[0]

  const handleDragStart = (event: any) => {
    const { active } = event
    const comp = activePage.components.find((c) => c.id === active.id)
    setDraggingComponent(comp)
  }

  const handleDragMove = (event: any) => {
    // Optional: compute snapping
    const { delta } = event
    // const { offsetX, offsetY } = getSnapOffset(...)
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (!over) return
    setDraggingComponent(null)
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragMove={handleDragMove} onDragEnd={handleDragEnd}>
      <div
        className="builder-canvas p-4 h-full overflow-auto bg-gray-50"
        style={{
          maxWidth: activeBreakpoint === "tablet" ? 768 : activeBreakpoint === "mobile" ? 375 : 1440,
          margin: "0 auto",
        }}
      >
        {activePage?.components?.map((component) => (
          <NodeRenderer key={component.id} component={component} />
        ))}

        {/* Drag overlay */}
        <DragOverlay>{draggingComponent && <NodeRenderer component={draggingComponent} />}</DragOverlay>
      </div>
    </DndContext>
  )
}

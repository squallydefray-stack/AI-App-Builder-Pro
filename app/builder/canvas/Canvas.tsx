// app/builder/canvas/Canvas.tsx
"use client"

import React, { useState } from "react"
import { NodeRenderer } from "@canvas/NodeRenderer"
import { useBuilderStore } from "@state/builderStore"
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay
} from "@dnd-kit/core"

type BuilderCanvasProps = {
  builderSchema: any
}

export const BuilderCanvas: React.FC<BuilderCanvasProps> = ({ builderSchema }) => {
  const { pages, activePageId, activeBreakpoint } = useBuilderStore()
  const [draggingComponent, setDraggingComponent] = useState<any>(null)

  const sensors = useSensors(useSensor(PointerSensor))

  const activePages = builderSchema?.pages || pages
  const activePage = activePages.find((p) => p.id === activePageId) || activePages[0]

  const handleDragStart = (event: any) => {
    const { active } = event
    const comp = activePage.components.find((c) => c.id === active.id)
    setDraggingComponent(comp)
  }

  const handleDragEnd = (event: any) => {
    setDraggingComponent(null)
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div
        className="builder-canvas p-4 h-full overflow-auto bg-gray-50"
        style={{
          maxWidth:
            activeBreakpoint === "tablet" ? 768 : activeBreakpoint === "mobile" ? 375 : 1440,
          margin: "0 auto"
        }}
      >
        {activePage?.components?.map((component) => (
          <NodeRenderer key={component.id} component={component} />
        ))}

        <DragOverlay>
          {draggingComponent ? <NodeRenderer component={draggingComponent} /> : null}
        </DragOverlay>
      </div>
    </DndContext>
  )
}
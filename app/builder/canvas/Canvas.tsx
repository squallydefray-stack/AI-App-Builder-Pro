// app/builder/canvas/Canvas.tsx
"use client"

import { DndContext } from "@dnd-kit/core"
import { NodeRenderer } from "@/builder/canvas/NodeRenderer"
import { useBuilderStore } from "@/builder/state/builderStore"

export function BuilderCanvas() {
  const { pages, activePageId, activeBreakpoint } = useBuilderStore()

  const activePage = pages.find(p => p.id === activePageId)

    
  if (!activePage) {
    return <div className="p-4">No active page</div>
  }

  return (
    <DndContext>
      <div
        className="relative h-full bg-gray-50 overflow-auto"
        style={{
          maxWidth:
            activeBreakpoint === "tablet"
              ? 768
              : activeBreakpoint === "mobile"
              ? 375
              : 1440,
          margin: "0 auto",
        }}
      >
        {activePage.components.map(component => (
          <NodeRenderer key={component.id} component={component} />
        ))}
      </div>
    </DndContext>
  )
}

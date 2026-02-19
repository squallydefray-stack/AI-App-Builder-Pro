"use client"

import React, { useRef, useState, useEffect } from "react"
import { BuilderComponent } from "@/lib/exporter/schema"
import NodeRenderer from "@components/NodeRenderer"

interface ComponentPaletteProps {
  components: BuilderComponent[]
}

export default function ComponentPalette({ components }: ComponentPaletteProps) {
  const ghostRef = useRef<HTMLDivElement>(null)
  const [draggingComp, setDraggingComp] = useState<BuilderComponent | null>(null)

  useEffect(() => {
    if (ghostRef.current) {
      // Hide ghost when not dragging
      ghostRef.current.style.display = draggingComp ? "block" : "none"
    }
  }, [draggingComp])

  return (
    <div className="w-60 p-4 bg-gray-100 border-r h-full overflow-y-auto relative">
      <h3 className="font-bold mb-2">Components</h3>

      {components.map((comp) => (
        <div
          key={comp.id}
          draggable
          onDragStart={(e) => {
            const newComp = { ...comp, id: `${comp.id}-${Date.now()}` }
            e.dataTransfer.setData("application/json", JSON.stringify(newComp))
            e.dataTransfer.effectAllowed = "copy"

            // Set current dragged component
            setDraggingComp(newComp)

            // Set ghost preview
            if (ghostRef.current) {
              e.dataTransfer.setDragImage(ghostRef.current, 0, 0)
            }
          }}
          onDragEnd={() => setDraggingComp(null)}
          className="cursor-grab p-2 mb-2 bg-white rounded border hover:bg-gray-50 shadow-sm"
        >
          {comp.type}
        </div>
      ))}

      {/* Ghost preview div */}
      <div
        ref={ghostRef}
        className="absolute top-0 left-0 pointer-events-none z-50"
        style={{ display: "none" }}
      >
        {draggingComp && (
          <NodeRenderer node={draggingComp} depth={0} breakpoint="desktop" />
        )}
      </div>
    </div>
  )
}

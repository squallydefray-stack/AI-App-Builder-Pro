"use client"

import React from "react"
import { BuilderComponent } from "@lib/exporter/schema"
import { useBuilderStore } from "@builder/state/builderStore"

const components: BuilderComponent[] = [
  { id: "text-block", name: "Text Block", props: { text: "New Text Block" }, children: [] },
  { id: "analytics-cards", name: "Analytics Cards", props: { data: [] }, children: [] },
  { id: "recent-activity-table", name: "Recent Activity Table", props: { tableData: [] }, children: [] },
]

export function ComponentPanel() {
  const addComponent = useBuilderStore((s) => s.addComponent)
  const snapshot = useBuilderStore((s) => s.snapshot)
  const activePageId = useBuilderStore((s) => s.activePageId)
  const pages = useBuilderStore((s) => s.pages)
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
      id: component.id,
      data: component, // important for DragOverlay
    })

  const handleInsert = (component: BuilderComponent) => {
    snapshot()
    const page = pages.find((p) => p.id === activePageId)
    if (!page) return
    page.components.push({ ...component, id: `${page.id}-${component.id}-${Date.now()}` })
    addComponent({ ...component, id: `${page.id}-${component.id}-${Date.now()}` })
  }

  return (
    <div className="p-4 border-r border-gray-200 w-64">
      <h2 className="font-semibold mb-4">Components</h2>
      {components.map((comp) => (
        <div
          key={comp.id}
          className="mb-2 p-2 border rounded cursor-pointer hover:bg-gray-100"
          onClick={() => handleInsert(comp)}
        >
          {comp.name}
        </div>
      ))}
    </div>
  )
}

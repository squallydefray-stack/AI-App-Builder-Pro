// app/builder/components/InspectorPanel.tsx
"use client"

import React from "react"
import { useBuilderStore } from "@state/builderStore"

export const BuilderInspector: React.FC = () => {
  const { selectedIds, pages, updateComponentProps } = useBuilderStore()
  const selectedId = selectedIds[0]
  if (!selectedId) return <div className="p-4 text-gray-400">Select a component</div>

  const findComponent = (components: any[]): any => {
    for (const comp of components) {
      if (comp.id === selectedId) return comp
      if (comp.children) {
        const found = findComponent(comp.children)
        if (found) return found
      }
    }
  }

  const activePage = pages[0] // Simplified: first page
  const component = findComponent(activePage.components)

  if (!component) return null

  return (
    <div className="builder-inspector w-64 border-l p-4 bg-white">
      <h3 className="font-bold mb-2">{component.type} Properties</h3>

      <div className="mb-2">
        <label className="block text-sm font-medium">Text</label>
        <input
          type="text"
          value={component.props.text || ""}
          onChange={(e) =>
            updateComponentProps(component.id, { ...component.props, text: e.target.value })
          }
          className="w-full border px-2 py-1 rounded"
        />
      </div>

      <div className="mb-2">
        <label className="block text-sm font-medium">ClassName</label>
        <input
          type="text"
          value={component.props.className || ""}
          onChange={(e) =>
            updateComponentProps(component.id, { ...component.props, className: e.target.value })
          }
          className="w-full border px-2 py-1 rounded"
        />
      </div>
    </div>
  )
}
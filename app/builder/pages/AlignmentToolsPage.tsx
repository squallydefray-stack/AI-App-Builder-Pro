// app/builder/pages/AlignmentToolsPage.tsx
"use client"
import React from "react"
import { useBuilderStore } from "../state/builderStore"
import NodeRenderer from "../canvas/NodeRenderer"
import { applyAlignment } from "../lib/alignmentTools"

export default function AlignmentToolsPage() {
  const pages = useBuilderStore((s) => s.pages)
  const activePageId = useBuilderStore((s) => s.activePageId)
  const selectedIds = useBuilderStore((s) => s.selectedIds)
  const updateMultipleComponents = useBuilderStore((s) => s.updateMultipleComponents)

  const handleAlign = (direction: "left" | "right" | "top" | "bottom" | "center") => {
    if (!activePageId) return
    const page = pages.find((p) => p.id === activePageId)
    if (!page) return
    const updated = applyAlignment(page, selectedIds, direction)
    updateMultipleComponents(updated)
  }

  const page = pages.find((p) => p.id === activePageId)
  if (!page) return <div>Select a page to use alignment tools</div>

  return (
    <div className="w-full h-full flex flex-col p-4 gap-4">
      <h1 className="text-2xl font-bold">Alignment Tools</h1>
      <div className="flex gap-2 mb-4">
        {["left","right","top","bottom","center"].map((dir) => (
          <button
            key={dir}
            onClick={() => handleAlign(dir as any)}
            className="px-3 py-1 border rounded hover:bg-gray-200"
          >
            {dir}
          </button>
        ))}
      </div>
      <div className="flex-1 border border-gray-300 rounded p-2 overflow-auto relative bg-gray-50">
        <NodeRenderer components={page.components} />
      </div>
    </div>
  )
}

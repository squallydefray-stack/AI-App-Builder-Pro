// app/builder/pages/AutoLayoutPage.tsx
"use client"
import React from "react"
import NodeRenderer from "../canvas/NodeRenderer"
import { useBuilderStore } from "../state/builderStore"

export default function AutoLayoutPage() {
  const pages = useBuilderStore((s) => s.pages)
  const activePageId = useBuilderStore((s) => s.activePageId)
  const page = pages.find((p) => p.id === activePageId)
  if (!page) return <div>Select a page to preview AutoLayout</div>

  return (
    <div className="w-full h-full flex flex-col p-4 gap-4">
      <h1 className="text-2xl font-bold">AutoLayout 2.0</h1>
      <div className="flex-1 border border-gray-300 rounded p-2 overflow-auto relative bg-gray-50">
        <NodeRenderer components={page.components} autoLayout snapGrid={10} />
      </div>
    </div>
  )
}

//
//  layoutEngine2.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/17/26.
//


// app/builder/pages/LayoutEnginePage.tsx
"use client"
import React, { useEffect } from "react"
import { useBuilderStore } from "@/state/builderStore"
import NodeRenderer from "./NodeRenderer"
import { generateLayoutWithConstraints } from "../lib/layoutEngine2"

export default function LayoutEnginePage() {
  const pages = useBuilderStore((s) => s.pages)
  const activePageId = useBuilderStore((s) => s.activePageId)
  const updateMultipleComponents = useBuilderStore((s) => s.updateMultipleComponents)

  useEffect(() => {
    if (!activePageId) return
    const page = pages.find((p) => p.id === activePageId)
    if (!page) return

    const newLayout = generateLayoutWithConstraints(page)
    updateMultipleComponents(newLayout)
  }, [activePageId, pages, updateMultipleComponents])

  const page = pages.find((p) => p.id === activePageId)
  if (!page) return <div>Select a page to preview layout</div>

  return (
    <div className="w-full h-full flex flex-col p-4 gap-4">
      <h1 className="text-2xl font-bold">Layout Engine 2.0</h1>
      <div className="flex-1 border border-gray-300 rounded p-2 overflow-auto">
        <NodeRenderer components={page.components} />
      </div>
    </div>
  )
}

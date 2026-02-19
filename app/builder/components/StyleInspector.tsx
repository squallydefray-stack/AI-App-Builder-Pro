//
//  StyleInspector.tsx
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/17/26.
//


"use client"

import React from "react"
import { useBuilderStore } from "../state/builderStore"
import StyleInspector from "./inspector/StyleInspector"

export default function InspectorPanel() {
  const { pages, activePageId, selectedIds } = useBuilderStore()

  const page = pages.find(p => p.id === activePageId)
  const selected = page?.components.find(c => c.id === selectedIds[0])

  if (!selected) {
    return (
      <div className="p-4 text-sm text-neutral-500">
        Select a component to edit styles
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6">
      <div>
        <h3 className="text-sm font-semibold mb-2">Component</h3>
        <div className="text-xs text-neutral-500">{selected.type}</div>
      </div>

      <StyleInspector component={selected} />
    </div>
  )
}

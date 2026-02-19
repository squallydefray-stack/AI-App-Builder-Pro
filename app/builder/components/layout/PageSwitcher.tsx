//
//  PageSwitcher.tsx
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/14/26.
//


// app/builder/components/layout/PageSwitcher.tsx
"use client"

import React from "react"
import { useBuilderStore } from "../../state/builderStore"

export default function PageSwitcher() {
  const pages = useBuilderStore((s) => s.pages)
  const activePageId = useBuilderStore((s) => s.activePageId)
  const setActivePage = useBuilderStore((s) => s.setActivePage)

  return (
    <div className="flex space-x-2">
      {pages.map((p) => (
        <button
          key={p.id}
          className={`px-3 py-1 rounded ${
            p.id === activePageId ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActivePage(p.id)}
        >
          {p.name}
        </button>
      ))}
    </div>
  )
}

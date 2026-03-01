// app/builder/canvas/BuilderDemo.tsx
"use client"

import React, { useState } from "react"
import { BuilderCanvas } from "@/builder/canvas/BuilderCanvas"
import PropsInspector from "@/builder/components/PropsInspector"
import { useBuilderStore } from "@/builder/state/builderStore"

export default function BuilderDemo() {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<"base" | "tablet" | "mobile">("base")
  const setActiveBreakpoint = useBuilderStore((s) => s.setActiveBreakpoint)
  const selectedIds = useBuilderStore((s) => s.selectedIds)
  const pages = useBuilderStore((s) => s.pages)
  const activePageId = useBuilderStore((s) => s.activePageId)

  const activePage = pages.find((p) => p.id === activePageId)

  const switchBreakpoint = (bp: "base" | "tablet" | "mobile") => {
    setCurrentBreakpoint(bp)
    setActiveBreakpoint(bp)
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 bg-gray-100 border-b">
        <div className="flex space-x-2">
          {(["base", "tablet", "mobile"] as const).map((bp) => (
            <button
              key={bp}
              className={`px-3 py-1 rounded ${
                currentBreakpoint === bp ? "bg-blue-500 text-white" : "bg-white border"
              }`}
              onClick={() => switchBreakpoint(bp)}
            >
              {bp.charAt(0).toUpperCase() + bp.slice(1)}
            </button>
          ))}
        </div>

        <div>
          {selectedIds[0] ? (
            <span className="text-sm text-gray-700">Selected: {selectedIds[0]}</span>
          ) : (
            <span className="text-sm text-gray-500">No selection</span>
          )}
        </div>
      </div>

      {/* Main Canvas + Props */}
      <div className="flex flex-1 overflow-hidden">
        {/* Canvas */}
        <div className="flex-1 overflow-auto p-4 bg-gray-50">
          {activePage ? (
            <BuilderCanvas page={activePage} multiSelect={true} />
          ) : (
            <div className="text-gray-400 text-center mt-20">No page selected</div>
          )}
        </div>

        {/* Props Inspector Panel */}
        <div className="w-80 border-l bg-white overflow-y-auto">
          {selectedIds.length > 0 && activePage ? (
            <PropsInspector
              component={useBuilderStore.getState().getSelected()[0]}
              breakpoint={currentBreakpoint}
            />
          ) : (
            <div className="text-gray-400 text-center mt-4">Select a component</div>
          )}
        </div>
      </div>
    </div>
  )
}

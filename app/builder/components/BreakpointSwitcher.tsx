// builder/components/BreakpointSwitcher.tsx
"use client"

import React from "react"
import { useBuilderStore } from "@state/builderStore"

export const BreakpointSwitcher: React.FC = () => {
  const { activeBreakpoint, setActiveBreakpoint } = useBuilderStore()
  const breakpoints: Array<"base" | "tablet" | "mobile"> = ["base", "tablet", "mobile"]

  return (
    <div className="flex gap-2 p-2 border-b bg-gray-50">
      {breakpoints.map((bp) => (
        <button
          key={bp}
          className={`px-3 py-1 rounded ${
            activeBreakpoint === bp ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveBreakpoint(bp)}
        >
          {bp.toUpperCase()}
        </button>
      ))}
    </div>
  )
}

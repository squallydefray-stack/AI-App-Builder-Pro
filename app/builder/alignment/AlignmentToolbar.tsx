// app/builder/alignment/AlignmentToolbar.tsx
"use client"

import React from "react"
import { useBuilderStore } from "@/builder/state/builderStore"

export default function AlignmentToolbar() {
  const selected = useBuilderStore((s) => s.getSelected())
  const updateMany = useBuilderStore((s) => s.updateMany)

  if (selected.length === 0) return null

  const alignLeft = () => {
    const minX = Math.min(...selected.map((c) => c.propsPerBreakpoint["base"].x || 0))
    const updated = selected.map((c) => ({
      ...c,
      propsPerBreakpoint: {
        ...c.propsPerBreakpoint,
        base: { ...c.propsPerBreakpoint.base, x: minX },
      },
    }))
    updateMany(updated)
  }

  const alignTop = () => {
    const minY = Math.min(...selected.map((c) => c.propsPerBreakpoint["base"].y || 0))
    const updated = selected.map((c) => ({
      ...c,
      propsPerBreakpoint: {
        ...c.propsPerBreakpoint,
        base: { ...c.propsPerBreakpoint.base, y: minY },
      },
    }))
    updateMany(updated)
  }

  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
      <button onClick={alignLeft}>Align Left</button>
      <button onClick={alignTop}>Align Top</button>
      {/* Add more alignment actions as needed */}
    </div>
  )
}
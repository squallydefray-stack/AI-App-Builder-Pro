"use client"

import React from "react"
import { useBuilderStore } from "@state/builderStore"
import NodeRenderer from "./NodeRenderer"

export default function ComponentTree() {
  const components = useBuilderStore((s) => s.components)
  const breakpoint = useBuilderStore((s) => s.breakpoint)

  if (components.length === 0)
    return (
      <div className="text-gray-400 text-center mt-10">
        Drag components here to start building
      </div>
    )

  return (
    <div className="w-full h-full overflow-auto p-4">
      {components.map((c) => (
        <NodeRenderer key={c.id} node={c} depth={0} breakpoint={breakpoint} />
      ))}
    </div>
  )
}

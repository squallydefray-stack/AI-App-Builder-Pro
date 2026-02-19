//
//  AlignmentToolbar.tsx
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/17/26.
//


"use client"
import React from "react"
import { useBuilderStore } from "@/builder/state/builderStore"
import { alignMultiple } from "@/lib/utils/layoutEngine"

export default function AlignmentToolbar() {
  const selected = useBuilderStore(s => s.getSelected())
  const updateMany = useBuilderStore(s => s.updateMany)

  const handleAlign = (dir: any) => {
    const updated = alignMultiple(selected, dir)
    updateMany(updated)
  }

  return (
    <div className="flex gap-2 p-2 border-b bg-white">
      <button onClick={() => handleAlign("left")}>Left</button>
      <button onClick={() => handleAlign("right")}>Right</button>
      <button onClick={() => handleAlign("top")}>Top</button>
      <button onClick={() => handleAlign("bottom")}>Bottom</button>
      <button onClick={() => handleAlign("center-x")}>Center X</button>
      <button onClick={() => handleAlign("center-y")}>Center Y</button>
    </div>
  )
}


"use client"

import React from "react"

interface Props {
  value?: {
    top?: string
    right?: string
    bottom?: string
    left?: string
  }
  onChange: (val: any) => void
}

export default function BoxModelEditor({ value = {}, onChange }: Props) {
  const update = (key: string, val: string) => {
    onChange({ ...value, [key]: val })
  }

  return (
    <div className="grid grid-cols-3 gap-1 text-xs text-center">
      <div />
      <input
        value={value.top || ""}
        onChange={(e) => update("top", e.target.value)}
        className="border rounded"
      />
      <div />

      <input
        value={value.left || ""}
        onChange={(e) => update("left", e.target.value)}
        className="border rounded"
      />
      <div className="border rounded bg-gray-100 py-3">Box</div>
      <input
        value={value.right || ""}
        onChange={(e) => update("right", e.target.value)}
        className="border rounded"
      />

      <div />
      <input
        value={value.bottom || ""}
        onChange={(e) => update("bottom", e.target.value)}
        className="border rounded"
      />
      <div />
    </div>
  )
}

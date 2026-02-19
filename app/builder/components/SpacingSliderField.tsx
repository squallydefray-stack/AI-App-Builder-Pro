//
//  SpacingSliderField.tsx
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/18/26.
//


"use client"

import { useState } from "react"

export default function SpacingSliderField({
  label,
  value,
  onChange,
}: any) {
  const [local, setLocal] = useState(value || 0)

  return (
    <div className="space-y-2 text-xs">
      <div className="flex justify-between">
        <span>{label}</span>
        <span>{local}px</span>
      </div>

      <input
        type="range"
        min={0}
        max={100}
        value={local}
        onChange={(e) => {
          const val = Number(e.target.value)
          setLocal(val)
          onChange(val)
        }}
        className="w-full"
      />
    </div>
  )
}

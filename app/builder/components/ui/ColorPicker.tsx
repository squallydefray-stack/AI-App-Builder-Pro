//
//  ColorPicker.tsx
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/17/26.
//


"use client"

import React from "react"

interface Props {
  label: string
  value?: string
  onChange: (value: string) => void
}

export default function ColorPicker({ label, value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-gray-500">{label}</span>
      <input
        type="color"
        value={value || "#000000"}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-8 rounded border"
      />
    </div>
  )
}

//
//  TokenSelect.tsx
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/17/26.
//


"use client"

import React from "react"

interface Option {
  label: string
  value: string
}

interface Props {
  label: string
  value?: string
  options: Option[]
  onChange: (value: string) => void
}

export default function TokenSelect({
  label,
  value,
  options,
  onChange,
}: Props) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-gray-500">{label}</span>
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded px-2 py-1 text-xs bg-white"
      >
        <option value="">None</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}

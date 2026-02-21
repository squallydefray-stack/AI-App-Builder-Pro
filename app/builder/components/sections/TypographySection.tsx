//
//  TypographySection.tsx
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/17/26.
//


"use client"

import React from "react"
import { BuilderComponent, Breakpoint } from "@lib/exporter/schema"
import { useBuilderStore } from "@/state/builderStore"

interface Props {
  component: BuilderComponent
  breakpoint: Breakpoint
}

export default function TypographySection({ component, breakpoint }: Props) {
  const { updateComponentProps } = useBuilderStore()
  const current = component.props[breakpoint] || {}

  const update = (key: string, value: string) => {
    updateComponentProps(component.id, breakpoint, {
      ...current,
      [key]: value,
    })
  }

  return (
    <div className="border rounded p-3">
      <h4 className="text-xs font-semibold mb-3">Typography</h4>

      <div className="space-y-2 text-xs">
        <input
          placeholder="Text"
          value={current.text || ""}
          onChange={e => update("text", e.target.value)}
          className="border px-2 py-1 rounded w-full"
        />

        <input
          placeholder="Font size (text-xl)"
          value={current.fontSize || ""}
          onChange={e => update("fontSize", e.target.value)}
          className="border px-2 py-1 rounded w-full"
        />

        <input
          placeholder="Font weight (font-bold)"
          value={current.fontWeight || ""}
          onChange={e => update("fontWeight", e.target.value)}
          className="border px-2 py-1 rounded w-full"
        />

        <input
          placeholder="Text color (text-red-500)"
          value={current.color || ""}
          onChange={e => update("color", e.target.value)}
          className="border px-2 py-1 rounded w-full"
        />
      </div>
    </div>
  )
}

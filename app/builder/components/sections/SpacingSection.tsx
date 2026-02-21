//
//  SpacingSection.tsx
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

export default function SpacingSection({ component, breakpoint }: Props) {
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
      <h4 className="text-xs font-semibold mb-3">Spacing</h4>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <input
          placeholder="Padding (p-4)"
          value={current.padding || ""}
          onChange={e => update("padding", e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <input
          placeholder="Margin (m-4)"
          value={current.margin || ""}
          onChange={e => update("margin", e.target.value)}
          className="border px-2 py-1 rounded"
        />
      </div>
    </div>
  )
}

"use client"

import React from "react"
import { BuilderComponent, Breakpoint } from "@lib/exporter/schema"
import { useBuilderStore } from "@/state/builderStore"

interface Props {
  component: BuilderComponent
  breakpoint: Breakpoint
}

export default function BackgroundSection({ component, breakpoint }: Props) {
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
      <h4 className="text-xs font-semibold mb-3">Background</h4>

      <input
        placeholder="Background (bg-blue-500)"
        value={current.background || ""}
        onChange={e => update("background", e.target.value)}
        className="border px-2 py-1 rounded w-full text-xs"
      />
    </div>
  )
}

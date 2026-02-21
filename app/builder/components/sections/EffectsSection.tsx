"use client"

import React from "react"
import { BuilderComponent, Breakpoint } from "@lib/exporter/schema"
import { useBuilderStore } from "@/state/builderStore"

interface Props {
  component: BuilderComponent
  breakpoint: Breakpoint
}

export default function BorderSection({ component, breakpoint }: Props) {
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
      <h4 className="text-xs font-semibold mb-3">Border</h4>

      <input
        placeholder="Border (border border-gray-300)"
        value={current.border || ""}
        onChange={e => update("border", e.target.value)}
        className="border px-2 py-1 rounded w-full text-xs"
      />
    </div>
  )
}

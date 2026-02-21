// app/builder/components/InspectorPanel.tsx



"use client"

import React, { useState, useEffect } from "react"
import { BuilderComponent } from "../../lib/exporter/schema"
import { useBuilderStore, Breakpoint } from "@/state/builderStore"

type PropsInspectorProps = {
  component: BuilderComponent
  breakpoint: Breakpoint
}

const styleKeys: (keyof React.CSSProperties)[] = [
  "padding",
  "margin",
  "background",
  "color",
  "fontSize",
  "border",
  "borderRadius",
  "flexDirection",
  "justifyContent",
  "alignItems",
  "gap",
]

export default function PropsInspector({ component, breakpoint }: PropsInspectorProps) {
  const updateComponent = useBuilderStore((s) => s.updateComponent)
  const [localProps, setLocalProps] = useState<Record<string, any>>({})

  // Combine base + breakpoint props for display
  useEffect(() => {
    const bpProps = component.props?.[breakpoint] || {}
    const baseProps = component.props?.desktop || {}
    const combined: Record<string, any> = { ...baseProps, ...bpProps }
    setLocalProps(combined)
  }, [component, breakpoint])

  // Update style for generic CSS keys
  const handleStyleChange = (key: string, value: string) => {
    const nextProps = {
      ...localProps,
      style: { ...(localProps.style || {}), [key]: value },
    }
    setLocalProps(nextProps)
    updateComponent(component.id, nextProps, breakpoint)
  }

  // Update x, y, width, height for live drag/resize
  const handlePositionChange = (key: "x" | "y" | "width" | "height", value: number) => {
    let nextProps = { ...localProps }

    if (key === "x" || key === "y") {
      nextProps.position = { ...(localProps.position || {}), [key]: value }
    } else {
      nextProps.style = { ...(localProps.style || {}), [key]: value }
    }

    setLocalProps(nextProps)
    updateComponent(component.id, nextProps, breakpoint)
  }

  return (
    <div>
      <h4 className="font-semibold mt-2 mb-2">
        {component.type} Props ({breakpoint})
      </h4>

      {/* Position & Size Controls */}
      {["x", "y", "width", "height"].map((key) => (
        <div key={key} className="mb-2">
          <label className="block text-sm text-gray-700">{key}</label>
          <input
            type="number"
            value={
              key === "x" || key === "y"
                ? localProps.position?.[key] || 0
                : localProps.style?.[key] || ""
            }
            onChange={(e) => handlePositionChange(key as any, Number(e.target.value))}
            className="mt-1 block w-full border rounded px-2 py-1 text-sm"
          />
        </div>
      ))}

      {/* Generic style keys */}
      <h5 className="mt-4 mb-2 font-semibold">Style</h5>
      {styleKeys.map((key) => (
        <div key={key} className="mb-2">
          <label className="block text-sm text-gray-700">{key}</label>
          <input
            type="text"
            value={localProps.style?.[key] || ""}
            onChange={(e) => handleStyleChange(key, e.target.value)}
            className="mt-1 block w-full border rounded px-2 py-1 text-sm"
          />
        </div>
      ))}
    </div>
  )
}

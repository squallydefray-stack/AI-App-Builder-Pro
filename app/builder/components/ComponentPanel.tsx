// app/builder/components/ComponentPanel.tsx
"use client"

import React from "react"
import { useBuilderStore } from "@/state/builderStore"
import { BuilderComponent } from "@lib/exporter/schema"
import { v4 as uuidv4 } from "uuid"

const AVAILABLE_COMPONENTS = [
  { type: "Text", label: "Text" },
  { type: "Button", label: "Button" },
  { type: "Repeater", label: "Repeater" },
  { type: "Container", label: "Container" },
]

export default function ComponentPanel() {
  const addComponent = useBuilderStore((s) => s.addComponent)

  const handleAdd = (type: string) => {
    const newComp: BuilderComponent = {
      id: uuidv4(),
      type,
      props: {
        base: type === "Text" ? { text: "New Text" } : type === "Button" ? { label: "Click Me" } : {},
      },
      children: [],
      layout: { autoLayout: { enabled: false, direction: "column" } },
    }
    addComponent(newComp)
  }

  return (
    <div className="flex flex-col gap-2 p-2">
      {AVAILABLE_COMPONENTS.map((c) => (
        <button
          key={c.type}
          onClick={() => handleAdd(c.type)}
          className="w-full px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-left"
        >
          {c.label}
        </button>
      ))}
    </div>
  )
}

//
//  ContainerInspector.tsx
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/18/26.
//


"use client"

import React from "react"
import { useBuilderStore } from "@/state/builderStore"

export default function ContainerInspector({ component }: any) {
  const { updateSchema } = useBuilderStore()

  const updateStyle = (key: string, value: any) => {
    updateSchema(schema => {
      const page = schema.pages.find(p => p.id === schema.pages[0].id)
      if (!page) return schema

      page.components = page.components.map(c =>
        c.id === component.id
          ? { ...c, styles: { ...c.styles, [key]: value } }
          : c
      )

      return { ...schema }
    })
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm">Flexbox</h3>

      <div>
        <label className="text-xs">Direction</label>
        <select
          value={component.styles?.flexDirection || "row"}
          onChange={(e) => updateStyle("flexDirection", e.target.value)}
          className="w-full border px-2 py-1 rounded text-xs"
        >
          <option value="row">Row</option>
          <option value="column">Column</option>
        </select>
      </div>

      <div>
        <label className="text-xs">Justify</label>
        <select
          value={component.styles?.justifyContent || "flex-start"}
          onChange={(e) => updateStyle("justifyContent", e.target.value)}
          className="w-full border px-2 py-1 rounded text-xs"
        >
          <option value="flex-start">Start</option>
          <option value="center">Center</option>
          <option value="flex-end">End</option>
          <option value="space-between">Space Between</option>
          <option value="space-around">Space Around</option>
        </select>
      </div>

      <div>
        <label className="text-xs">Align Items</label>
        <select
          value={component.styles?.alignItems || "stretch"}
          onChange={(e) => updateStyle("alignItems", e.target.value)}
          className="w-full border px-2 py-1 rounded text-xs"
        >
          <option value="stretch">Stretch</option>
          <option value="flex-start">Start</option>
          <option value="center">Center</option>
          <option value="flex-end">End</option>
        </select>
      </div>

      <div>
        <label className="text-xs">Gap</label>
        <input
          type="number"
          value={component.styles?.gap || 0}
          onChange={(e) => updateStyle("gap", `${e.target.value}px`)}
          className="w-full border px-2 py-1 rounded text-xs"
        />
      </div>

      <hr />

      <h3 className="font-semibold text-sm">Grid</h3>

      <div>
        <label className="text-xs">Columns</label>
        <input
          value={component.styles?.gridTemplateColumns || ""}
          onChange={(e) => updateStyle("gridTemplateColumns", e.target.value)}
          placeholder="repeat(3, 1fr)"
          className="w-full border px-2 py-1 rounded text-xs"
        />
      </div>

      <div>
        <label className="text-xs">Rows</label>
        <input
          value={component.styles?.gridTemplateRows || ""}
          onChange={(e) => updateStyle("gridTemplateRows", e.target.value)}
          className="w-full border px-2 py-1 rounded text-xs"
        />
      </div>
    </div>
  )
}

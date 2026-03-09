//
//  LivePreviewPanel.tsx
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/17/26.
//


"use client"

import React from "react"
import { useBuilderStore } from "@/state/builderStore"
import { BuilderPage } from "@lib/exporter/schema"

interface LivePreviewPanelProps {
  width?: string
  height?: string
}

export default function LivePreviewPanel({ width = "400px", height = "600px" }: LivePreviewPanelProps) {
  const { pages, activePageId, switchPage } = useBuilderStore()
  const page = pages.find((p) => p.id === activePageId)

  if (!page) return <div className="text-gray-500 p-4">No page selected</div>

  return (
    <div
      className="border rounded shadow-lg bg-white overflow-auto"
      style={{ width, height }}
    >
      {/* Page Header */}
      <div className="flex justify-between items-center p-2 border-b bg-gray-100">
        <span className="font-medium text-sm">{page.name}</span>
        <select
          value={activePageId || ""}
          onChange={(e) => switchPage(e.target.value)}
          className="text-xs px-1 border rounded"
        >
          {pages.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* Page Canvas Preview */}
      <div className="relative p-4" style={{ minHeight: "100%" }}>
        {page.components.map((component) => (
          <PreviewNode key={component.id} component={component} />
        ))}
      </div>
    </div>
  )
}

/** =========================
 * Recursive Node Renderer for Preview
 ========================== */
import { BuilderComponent } from "@lib/exporter/schema"

function PreviewNode({ component }: { component: BuilderComponent }) {
  const style: React.CSSProperties = {
    position: "absolute",
    top: component.props.base?.top || 0,
    left: component.props.base?.left || 0,
    width: component.props.base?.width || 100,
    height: component.props.base?.height || 50,
    backgroundColor: component.props.base?.backgroundColor || "#eee",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "10px",
    overflow: "hidden",
  }

  return (
    <>
      <div style={style}>
        {component.props.base?.text || component.type}
      </div>
      {component.children?.map((child) => (
        <PreviewNode key={child.id} component={child} />
      ))}
    </>
  )
}

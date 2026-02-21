//
//  ExportPreviewPage.tsx
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/17/26.
//


"use client"

import React, { useState, useMemo } from "react"
import { useBuilderStore } from "@/state/builderStore"
import NodeRenderer from "./NodeRenderer"
import { BuilderComponent } from "@lib/exporter/schema"
import ExportPage from "./ExportPage"

export default function LiveExportPreview() {
  const pages = useBuilderStore((s) => s.pages)
  const activePageId = useBuilderStore((s) => s.activePageId)
  const breakpoint = useBuilderStore((s) => s.previewMode)
  const page = pages.find((p) => p.id === activePageId)
  const [platform, setPlatform] = useState<"web" | "react-native">("web")
  const [errorProps, setErrorProps] = useState<string[]>([])

  // ===============================
  // Helper: recursively check for unsupported props
  // ===============================
  const checkUnsupportedProps = (component: BuilderComponent) => {
    const unsupported: string[] = []
    const keys = Object.keys(component.props || {})
    keys.forEach((k) => {
      if (!["base", "tablet", "mobile"].includes(k)) unsupported.push(`${component.id}:${k}`)
    })
    if (component.children)
      component.children.forEach((c) => unsupported.push(...checkUnsupportedProps(c)))
    return unsupported
  }

  // ===============================
  // Compute unsupported props
  // ===============================
  const unsupported = useMemo(() => {
    if (!page) return []
    const allUnsupported: string[] = []
    page.components.forEach((c) => allUnsupported.push(...checkUnsupportedProps(c)))
    setErrorProps(allUnsupported)
    return allUnsupported
  }, [page])

  if (!page) return <div>No page selected</div>

  // ===============================
  // Live Preview Rendering
  // ===============================
  return (
    <div className="flex flex-col md:flex-row w-full h-full">
      {/* Left Panel: Controls */}
      <div className="md:w-1/4 p-4 border-r h-full space-y-4">
        <h2 className="text-xl font-bold">Live Export Preview</h2>

        <div className="space-y-2">
          <label>Platform:</label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value as "web" | "react-native")}
            className="border px-2 py-1 rounded w-full"
          >
            <option value="web">Next.js (Web)</option>
            <option value="react-native">React Native</option>
          </select>
        </div>

        <div className="space-y-2">
          <label>Breakpoint:</label>
          <select
            value={breakpoint}
            onChange={(e) => useBuilderStore.setState({ previewMode: e.target.value as any })}
            className="border px-2 py-1 rounded w-full"
          >
            <option value="desktop">Desktop</option>
            <option value="tablet">Tablet</option>
            <option value="mobile">Mobile</option>
          </select>
        </div>

        {errorProps.length > 0 && (
          <div className="bg-red-100 p-2 rounded text-sm text-red-700">
            Unsupported props detected: <br /> {errorProps.join(", ")}
          </div>
        )}

        {/* Export button embedded */}
        <ExportPage />
      </div>

      {/* Right Panel: Live Canvas Preview */}
      <div
        className="md:w-3/4 p-4 overflow-auto relative bg-gray-50"
        style={{ minHeight: "600px" }}
      >
        {/* Render all components recursively */}
        {page.components.map((c) => (
          <NodeRenderer
            key={c.id}
            component={c}
            parentWidth={800} // optional width simulation
            parentHeight={600}
          />
        ))}
      </div>
    </div>
  )
}

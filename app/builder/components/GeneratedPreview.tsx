//
//  GeneratedPreview.tsx
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/24/26.
//


// app/builder/components/GeneratedPreview.tsx
"use client"

import React, { useEffect, useState } from "react"
import { useBuilderStore } from "@/builder/state/builderStore"
import { exportToReact } from "@/lib/exporter/realExporter"
import { Breakpoint } from "@lib/exporter/schema"

export default function GeneratedPreview() {
  const pages = useBuilderStore((s) => s.pages)
  const activePageId = useBuilderStore((s) => s.activePageId)
  const activeBreakpoint = useBuilderStore((s) => s.activeBreakpoint)

  const [code, setCode] = useState<Record<Breakpoint, string>>({
    base: "",
    tablet: "",
    mobile: "",
  })

  useEffect(() => {
    if (!activePageId) return
    const page = pages.find((p) => p.id === activePageId)
    if (!page) return

    const breakpoints: Breakpoint[] = ["base", "tablet", "mobile"]
    const newCode: Record<Breakpoint, string> = {} as unknown
    breakpoints.forEach((bp) => {
      newCode[bp] = exportToReact(page.components, bp)
    })
    setCode(newCode)
  }, [pages, activePageId])

  if (!activePageId) return <div>No page selected</div>

  return (
    <div style={{ borderTop: "1px solid #ccc", padding: 12, maxHeight: "300px", overflowY: "auto" }}>
      <h3>Generated JSX Preview</h3>
      <div style={{ marginBottom: 8 }}>
        {(["base", "tablet", "mobile"] as Breakpoint[]).map((bp) => (
          <button
            key={bp}
            onClick={() => useBuilderStore.setState({ activeBreakpoint: bp })}
            style={{
              marginRight: 8,
              padding: "4px 8px",
              background: activeBreakpoint === bp ? "#0070f4" : "#f5f5f5",
              color: activeBreakpoint === bp ? "#fff" : "#000",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            {bp}
          </button>
        ))}
      </div>

      <pre style={{ background: "#1e1e1e", color: "#d4d4d4", padding: 12, borderRadius: 4 }}>
        {code[activeBreakpoint]}
      </pre>
    </div>
  )
}
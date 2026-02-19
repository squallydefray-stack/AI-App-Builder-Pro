//
//  pages.tsx
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/13/26.
//


"use client"

import { exportNextJSApp } from "../../../lib/exporter/nextjsExporter"
import { useBuilderStore } from "../state/builderStore"
import { normalizeComponents } from "../../../lib/exporter/normalizer"

export default function ExportPage() {
  const components = useBuilderStore((s) => s.components)

  const handleExport = async () => {
    const normalized = normalizeComponents(components)

    const blob = await exportNextJSApp({
      pages: [
        {
          name: "Home",
          components: normalized,
        },
      ],
    })

    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "ai-app-builder-export.zip"
    a.click()
  }

  return (
    <div className="p-10">
      <button
        onClick={handleExport}
        className="bg-black text-white px-6 py-3 rounded"
      >
        Export Next.js App
      </button>
    </div>
  )
}

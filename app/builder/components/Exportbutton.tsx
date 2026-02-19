// app/builder/components/ExportButton.tsx
// Exportbutton.tsx
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/13/26.
//


// app/builder/components/ExportButton.tsx
"use client"

import React from "react"
import { useBuilderStore } from "../state/builderStore"

export default function ExportButton() {
  const components = useBuilderStore((s) => s.components)
  const exportProgress = useBuilderStore((s) => s.exportProgress)
  const exportStatus = useBuilderStore((s) => s.exportStatus)
  const setExportProgress = useBuilderStore((s) => s.setExportProgress)
  const setExportStatus = useBuilderStore((s) => s.setExportStatus)

  const handleExport = async () => {
    setExportStatus("running")
    setExportProgress("Starting export...")

    try {
      const res = await fetch("/api/export/github", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ components }),
      })

      const data = await res.json()

      if (res.ok && data.url) {
        setExportStatus("success")
        setExportProgress(`GitHub Repo Created: ${data.url}`)

        if (data.zip) {
          setExportProgress("Downloading ZIP...")
          const a = document.createElement("a")
          a.href = data.zip
          a.download = "ai-builder.zip"
          a.click()
        }
      } else {
        throw new Error(data.error || "Unknown error")
      }
    } catch (err: any) {
      console.error("Export failed:", err)
      setExportStatus("error")
      setExportProgress(err.message || "Export failed")
    }
  }

  return (
    <div className="mt-2">
      <button
        onClick={handleExport}
        disabled={exportStatus === "running"}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {exportStatus === "running" ? exportProgress || "Exporting..." : "Export App"}
      </button>

      {exportStatus === "error" && (
        <p className="text-red-500 text-sm mt-1">{exportProgress}</p>
      )}
      {exportStatus === "success" && (
        <p className="text-green-500 text-sm mt-1">{exportProgress}</p>
      )}
    </div>
  )
}

"use client"

import { useState } from "react"
import { useBuilderStore } from "./state/builderStore"
import Canvas from "./canvas/Canvas"
import InspectorPanel from "./components/InspectorPanel"
import PageTree from "./components/PageTree"

export default function BuilderPage() {
  const pages = useBuilderStore((s) => s.pages)
  const activePageId = useBuilderStore((s) => s.activePageId)

  const [isExporting, setIsExporting] = useState(false)
  const [exportResult, setExportResult] = useState<string | null>(null)

  async function handleExportZip() {
    try {
      setIsExporting(true)
      setExportResult(null)

      const res = await fetch("/api/export/zip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pages }),
      })

      if (!res.ok) {
        throw new Error("Export failed")
      }

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = url
      a.download = "ai-app-export.zip"
      a.click()

      window.URL.revokeObjectURL(url)
      setExportResult("ZIP export successful")
    } catch (err) {
      console.error(err)
      setExportResult("Export failed")
    } finally {
      setIsExporting(false)
    }
  }

  async function handleExportGithub() {
    try {
      setIsExporting(true)
      setExportResult(null)

      const res = await fetch("/api/export/github", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pages }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "GitHub export failed")
      }

      setExportResult(`Pushed to GitHub: ${data.commitHash}`)
    } catch (err) {
      console.error(err)
      setExportResult("GitHub export failed")
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="h-screen flex bg-neutral-950 text-white">

      {/* Sidebar */}
      <div className="w-64 border-r border-neutral-800 flex flex-col">
        <div className="p-4 font-semibold text-lg border-b border-neutral-800">
          Pages
        </div>
        <PageTree />
        <div className="p-4 border-t border-neutral-800 space-y-2">
          <button
            onClick={handleExportZip}
            disabled={isExporting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-4 py-2 rounded-lg"
          >
            {isExporting ? "Exporting..." : "Export ZIP"}
          </button>

          <button
            onClick={handleExportGithub}
            disabled={isExporting}
            className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 px-4 py-2 rounded-lg"
          >
            {isExporting ? "Exporting..." : "Export to GitHub"}
          </button>

          {exportResult && (
            <div className="text-xs text-neutral-400 mt-2">
              {exportResult}
            </div>
          )}
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 overflow-hidden">
        {activePageId ? (
          <Canvas />
        ) : (
          <div className="h-full flex items-center justify-center text-neutral-500">
            Select a page to begin
          </div>
        )}
      </div>

      {/* Inspector */}
      <div className="w-80 border-l border-neutral-800">
        <InspectorPanel />
      </div>
    </div>
  )
}

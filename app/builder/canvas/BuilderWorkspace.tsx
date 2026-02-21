"use client"
import React from "react"
import Canvas from "@canvas/Canvas"
import PageTree from "@builderComponents/PageTree" 
import InspectorPanel from "@builderComponents/InspectorPanel"
import { useBuilderStore } from "@/state/builderStore"

export default function BuilderWorkspace() {
  const { pages, activePageId } = useBuilderStore()
  const activePage = pages.find((p) => p.id === activePageId)

  const handleExportGithub = async () => {
    try {
      const res = await fetch("/api/github/export-to-github", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pages }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Export failed")
      alert(`GitHub Exported! Commit: ${data.commitHash}`)
    } catch (err: any) {
      console.error(err)
      alert(`Export failed: ${err.message}`)
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-64 bg-gray-50 border-r flex flex-col">
        <PageTree />
        <ComponentPanel />
      </div>

      <div className="flex-1 bg-white p-4 overflow-auto">
        {activePage ? <Canvas page={activePage} /> : <div className="text-gray-400 text-center mt-20">No page selected</div>}
      </div>

      <div className="w-64 bg-gray-50 border-l flex flex-col justify-between">
        <InspectorPanel />
        <button onClick={handleExportGithub} className="m-4 py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600">
          Export to GitHub
        </button>
      </div>
    </div>
  )
}

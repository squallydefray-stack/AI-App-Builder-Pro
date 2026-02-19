// app/builder/components/ExportPanel.tsx
"use client"

import React, { useState, useEffect } from "react"
import { useBuilderStore } from "@/builder/state/builderStore"
import { exportToGithub } from "@/app/api/export/github/route"

export default function ExportPanel() {
  const builderStore = useBuilderStore()
  const [repoName, setRepoName] = useState("")
  const [exporting, setExporting] = useState(false)
  const [repoUrl, setRepoUrl] = useState<string | null>(null)
  const [previewComponents, setPreviewComponents] = useState<any[]>([])

  // Pull latest snapshot for live preview
  useEffect(() => {
    const pages = builderStore.getSnapshotForExport()
    const comps: any[] = []
    pages.forEach((p) =>
      p.components.forEach((c: any) => comps.push({ page: p.name, ...c }))
    )
    setPreviewComponents(comps)
  }, [builderStore.pages])

  const handleExport = async () => {
    if (!repoName.trim()) return alert("Enter a repository name")
    setExporting(true)

    try {
      const pages = builderStore.getSnapshotForExport()
      const url = await exportToGithub({ accessToken: "FAKE_TOKEN_FOR_UI" }, pages, repoName)
      setRepoUrl(url)
    } catch (err: any) {
      console.error("Export failed", err)
      alert(err.message || "Export failed")
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="p-6 bg-gray-900 border border-gray-800 rounded-2xl w-[400px] space-y-4">
      <h2 className="text-xl font-bold mb-2">Export to GitHub</h2>

      <input
        type="text"
        placeholder="Repository name"
        value={repoName}
        onChange={(e) => setRepoName(e.target.value)}
        className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700"
      />

      <button
        onClick={handleExport}
        disabled={exporting}
        className="w-full py-2 bg-green-600 rounded hover:bg-green-500 transition"
      >
        {exporting ? "Exporting..." : "Export"}
      </button>

      {repoUrl && (
        <div className="mt-2 text-sm text-blue-400 break-all">
          Repo URL: <a href={repoUrl} target="_blank">{repoUrl}</a>
        </div>
      )}

      <div className="mt-4">
        <h3 className="font-semibold mb-2">Preview Components</h3>
        <div className="max-h-48 overflow-auto border border-gray-700 rounded p-2 space-y-1">
          {previewComponents.map((c, idx) => (
            <div
              key={idx}
              className="px-2 py-1 bg-gray-800 rounded text-sm flex justify-between"
            >
              <span>{c.type}</span>
              {c.repeat?.items?.length && (
                <span className="text-xs text-gray-400">×{c.repeat.items.length}</span>
              )}
              {c.props?.base && <span className="text-xs text-blue-400">constrained</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

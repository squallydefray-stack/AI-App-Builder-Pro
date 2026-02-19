// app/builder/components/layout/ExportPanel.tsx
"use client"

import React, { useState } from "react"
import { useBuilderStore } from "@state/builderStore"

export default function ExportPanel() {
  const pages = useBuilderStore((s) => s.pages)
  const [repoName, setRepoName] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleExport = async () => {
    if (!repoName.trim()) {
      setMessage("Please enter a repository name")
      return
    }
    if (!pages.length) {
      setMessage("No pages to export")
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const res = await fetch("/api/export/github", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pages, repoName: repoName.trim() }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Export failed")

      setMessage(`Exported successfully! Repo URL: ${data.url}`)
    } catch (err: any) {
      setMessage(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 bg-gray-100 rounded shadow space-y-2 w-full max-w-md">
      <h2 className="font-bold text-lg">Export to GitHub</h2>

      <input
        type="text"
        placeholder="Repository name"
        value={repoName}
        onChange={(e) => setRepoName(e.target.value)}
        className="w-full border px-2 py-1 rounded"
      />

      <button
        onClick={handleExport}
        disabled={loading}
        className={`w-full py-2 rounded text-white ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Exporting..." : "Export"}
      </button>

      {message && (
        <div
          className={`p-2 rounded ${
            message.startsWith("Error") ? "bg-red-200 text-red-800" : "bg-green-200 text-green-800"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  )
}

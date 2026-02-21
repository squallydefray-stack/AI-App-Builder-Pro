//
//  ExportGitHubButton.tsx
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/14/26.
//


"use client"

import React, { useState } from "react"
import { useBuilderStore } from "@/state/builderStore"

export const ExportGitHubButton: React.FC = () => {
  const pages = useBuilderStore((state) => state.pages)

  const [repoName, setRepoName] = useState("my-ai-app")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleExport = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/export/github", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repoName,
          pages,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Export failed")
      }

      window.open(data.url, "_blank")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-3">
      <input
        value={repoName}
        onChange={(e) => setRepoName(e.target.value)}
        className="border px-3 py-2 rounded text-sm"
        placeholder="Repository name"
      />

      <button
        onClick={handleExport}
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded"
      >
        {loading ? "Exporting..." : "Export to GitHub"}
      </button>

      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  )
}

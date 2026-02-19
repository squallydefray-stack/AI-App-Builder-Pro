//
//  GithubExportPanel.tsx
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/17/26.
//


"use client"

import React, { useState } from "react"
import { useBuilderStore } from "../state/builderStore"

export default function GitHubExportPanel() {
  const pages = useBuilderStore((s) => s.pages)
  const [repoName, setRepoName] = useState("")
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState("")

  const handleExport = async () => {
    if (!repoName.trim()) {
      alert("Enter a repository name")
      return
    }

    setLoading(true)
    setStatus("Starting export...")

    try {
      const res = await fetch("/api/export/github", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoName, pages }),
      })
      const data = await res.json()

      if (data.url) {
        setStatus(`✅ Exported successfully: ${data.url}`)
      } else {
        setStatus(`❌ Export failed: ${data.message || "Unknown error"}`)
      }
    } catch (err) {
      console.error(err)
      setStatus(`❌ Export failed: ${err}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="absolute bottom-4 right-4 w-96 bg-gray-900 border border-gray-700 rounded-xl p-4 shadow-lg space-y-3 text-white">
      <h3 className="font-semibold text-lg">GitHub Export</h3>

      <input
        type="text"
        placeholder="Repository name"
        value={repoName}
        onChange={(e) => setRepoName(e.target.value)}
        className="w-full px-3 py-2 rounded bg-gray-800 text-white text-sm"
      />

      <button
        onClick={handleExport}
        disabled={loading}
        className={`w-full py-2 rounded text-white font-medium ${
          loading ? "bg-gray-600" : "bg-green-600 hover:bg-green-500"
        }`}
      >
        {loading ? "Exporting..." : "Push to GitHub"}
      </button>

      {status && <div className="text-sm mt-2 break-words">{status}</div>}
    </div>
  )
}

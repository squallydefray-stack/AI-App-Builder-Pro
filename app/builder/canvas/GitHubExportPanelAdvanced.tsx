"use client"

import React, { useState, useEffect } from "react"
import { useBuilderStore } from "../state/builderStore"

interface CommitRecord {
  sha: string
  message: string
  timestamp: string
  url?: string
}

export default function GitHubExportPanelAdvanced() {
  const pages = useBuilderStore((s) => s.pages)
  const [repoName, setRepoName] = useState("")
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState("")
  const [history, setHistory] = useState<CommitRecord[]>([])
  const [diffPreview, setDiffPreview] = useState<string>("")

  // Auto branch/commit message suggestion
  const generateCommitMessage = () => {
    if (!pages.length) return "Initial commit"
    const changedPages = pages.map((p) => p.name).join(", ")
    return `Update pages: ${changedPages}`
  }

  const handleExport = async () => {
    if (!repoName.trim()) {
      alert("Enter a repository name")
      return
    }

    setLoading(true)
    setStatus("Starting export...")
    setDiffPreview("Calculating diff...")

    try {
      // 1️⃣ Generate a diff preview
      const diffRes = await fetch("/api/export/diff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pages }),
      })
      const diffData = await diffRes.json()
      setDiffPreview(diffData.diff || "No changes detected.")

      // 2️⃣ Push to GitHub
      const exportRes = await fetch("/api/export/github", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repoName,
          pages,
          branch: "ai-auto-update",
          commitMessage: generateCommitMessage(),
        }),
      })

      const exportData = await exportRes.json()

      if (exportData.url) {
        const commitRecord: CommitRecord = {
          sha: exportData.sha || "unknown",
          message: generateCommitMessage(),
          timestamp: new Date().toISOString(),
          url: exportData.url,
        }
        setHistory([commitRecord, ...history])
        setStatus(`✅ Export successful: ${exportData.url}`)
      } else {
        setStatus(`❌ Export failed: ${exportData.message || "Unknown error"}`)
      }
    } catch (err) {
      console.error(err)
      setStatus(`❌ Export failed: ${err}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="absolute bottom-4 right-4 w-96 bg-gray-900 border border-gray-700 rounded-xl p-4 shadow-lg space-y-3 text-white text-sm">
      <h3 className="font-semibold text-lg">GitHub Export + History</h3>

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
        {loading ? "Exporting..." : "Push & Commit"}
      </button>

      {status && <div className="mt-2 break-words">{status}</div>}

      {diffPreview && (
        <div className="mt-2 bg-gray-800 p-2 rounded max-h-32 overflow-auto font-mono text-xs whitespace-pre-wrap">
          {diffPreview}
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-2 space-y-1">
          <h4 className="font-semibold">Commit History</h4>
          {history.map((c) => (
            <div key={c.sha} className="bg-gray-800 p-2 rounded">
              <div className="flex justify-between">
                <span className="truncate">{c.message}</span>
                <a
                  href={c.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 hover:underline ml-2"
                >
                  View
                </a>
              </div>
              <div className="text-gray-400 text-xs">{new Date(c.timestamp).toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

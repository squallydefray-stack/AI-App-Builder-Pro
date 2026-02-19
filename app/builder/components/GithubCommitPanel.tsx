//
//  GithubCommitPanel.tsx
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/17/26.
//


"use client"

import React, { useEffect, useState } from "react"
import { useBuilderStore } from "@state/builderStore"

interface DiffFile {
  path: string
  type: "added" | "modified" | "deleted"
  preview?: string
}

export default function GitHubCommitPanel() {
  const { pages } = useBuilderStore()
  const [diffFiles, setDiffFiles] = useState<DiffFile[]>([])
  const [commitMessage, setCommitMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [pushResult, setPushResult] = useState<string | null>(null)

  // 1️⃣ Fetch diff from backend (or simulate via snapshots)
  useEffect(() => {
    // For demo: create a diff based on current pages
    const diffs: DiffFile[] = pages.map((p) => ({
      path: `pages/${p.name}.json`,
      type: "modified",
      preview: JSON.stringify(p.components, null, 2).slice(0, 200),
    }))
    setDiffFiles(diffs)
  }, [pages])

  // 2️⃣ Push to GitHub
  const handlePush = async () => {
    if (!commitMessage.trim()) {
      alert("Enter a commit message")
      return
    }

    setLoading(true)
    setPushResult(null)

    try {
      const res = await fetch("/api/export/githubFull", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repoName: "ai-builder-project",
          pages,
          commitMessage,
        }),
      })

      const data = await res.json()
      if (data.url) setPushResult(`Success! Commit: ${data.url}`)
      else setPushResult(`Error: ${data.error}`)
    } catch (err) {
      console.error(err)
      setPushResult(`Error: ${(err as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-96 bg-gray-900 border-l border-gray-800 h-full flex flex-col p-4">
      <h2 className="text-xl font-bold mb-3">GitHub Commit Panel</h2>

      <textarea
        placeholder="Commit message"
        value={commitMessage}
        onChange={(e) => setCommitMessage(e.target.value)}
        className="w-full p-2 mb-4 bg-gray-800 border border-gray-700 rounded text-white"
      />

      <div className="flex-1 overflow-auto mb-4">
        {diffFiles.map((f) => (
          <div key={f.path} className="mb-2 p-2 border border-gray-700 rounded">
            <div className="text-sm font-mono text-gray-400">{f.path} ({f.type})</div>
            <pre className="text-xs text-gray-200 overflow-x-auto">{f.preview}</pre>
          </div>
        ))}
      </div>

      <button
        onClick={handlePush}
        disabled={loading}
        className="w-full py-2 bg-blue-600 rounded hover:bg-blue-500 transition mb-2"
      >
        {loading ? "Pushing..." : "Push to GitHub"}
      </button>

      {pushResult && <div className="text-sm text-green-400 mt-2">{pushResult}</div>}
    </div>
  )
}

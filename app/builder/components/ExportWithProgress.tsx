//
//  ExportWithProgress.tsx
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/13/26.
//


"use client"

import React, { useState } from "react"
import { useBuilderStore } from "../state/builderStore"

export default function ExportWithProgress() {
  const { pages } = useBuilderStore()   // includes all responsive props
  const [logs, setLogs] = useState<string[]>([])
  const [zipUrl, setZipUrl] = useState<string | null>(null)

  const startExport = () => {
    setLogs([])
    setZipUrl(null)

    // Open SSE connection
    const evtSource = new EventSource("/api/export/github-progress")
    evtSource.onmessage = (e) => {
      setLogs((prev) => [...prev, e.data])
      if (e.data.startsWith("ZIP ready: ")) {
        const url = e.data.replace("ZIP ready: ", "")
        setZipUrl(url)
        const a = document.createElement("a")
        a.href = url
        a.download = "ai-builder.zip"
        a.click()
      }
    }
    evtSource.onerror = () => evtSource.close()

    // Trigger pipeline POST
    fetch("/api/export/github-progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pages }),
    })
  }

  return (
    <div>
      <button
        onClick={startExport}
        className="px-4 py-2 bg-blue-600 text-white rounded mb-4"
      >
        Export Project
      </button>

      <div className="p-4 bg-gray-100 rounded h-64 overflow-y-auto">
        {logs.map((log, i) => (
          <p key={i} className="text-sm font-mono">{log}</p>
        ))}
      </div>

      {zipUrl && (
        <p className="mt-2">
          Download ZIP: <a href={zipUrl} download>Click here</a>
        </p>
      )}
    </div>
  )
}

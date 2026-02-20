// app/builder/components/LiveLogs.tsx

"use client"
import React, { useEffect, useState } from "react"

interface LiveLogsProps {
  deploymentId: string
}

export default function LiveLogs({ deploymentId }: LiveLogsProps) {
  const [logs, setLogs] = useState("")

  useEffect(() => {
    const evtSource = new EventSource(`/api/deploy/vercel/stream?id=${deploymentId}`)
    evtSource.onmessage = (event) => setLogs((prev) => prev + event.data + "\n")
    evtSource.onerror = () => evtSource.close()
    return () => evtSource.close()
  }, [deploymentId])

  const handleDownload = async () => {
    const res = await fetch(`/api/deploy/vercel/logs?id=${deploymentId}`)
    const text = await res.text()
    const blob = new Blob([text], { type: "text/plain" })
    const url = window.URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = `deployment-${deploymentId}-logs.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="mt-2 p-2 border border-gray-700 bg-gray-900 rounded max-h-48 overflow-y-auto">
      <div className="flex justify-between items-center mb-1">
        <h2 className="text-sm font-semibold text-white">Live Logs</h2>
        <button
          onClick={handleDownload}
          className="px-2 py-1 text-xs bg-gray-600 hover:bg-gray-500 rounded text-white"
        >
          Download
        </button>
      </div>
      <pre className="text-xs text-gray-200">{logs || "Waiting for logs..."}</pre>
    </div>
  )
}
"use client"

import { useState, useEffect, useRef } from "react"
import { useBuilderStore } from "@state/builderStore"

interface DeployRecord {
  repoName: string
  repoUrl: string
  deploymentUrl: string
  timestamp: number
}

export default function AIDeployPanel() {
  const { getSnapshotForExport } = useBuilderStore()
  const [repoName, setRepoName] = useState("")
  const [logs, setLogs] = useState<string[]>([])
  const [history, setHistory] = useState<DeployRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    // Connect to WebSocket server
    wsRef.current = new WebSocket("ws://localhost:8081")

    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === "log") {
        setLogs((prev) => [...prev, data.message])
      }
    }

    wsRef.current.onclose = () => console.log("WS connection closed")

    return () => wsRef.current?.close()
  }, [])

  const handleDeploy = async () => {
    if (!repoName) {
      setError("Repo name required")
      return
    }

    setLoading(true)
    setLogs([])
    setError(null)

    try {
      const snapshot = getSnapshotForExport()
      const res = await fetch("/api/ai-deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoName, builderSnapshot: snapshot }),
      })

      const data = await res.json()
      if (!res.ok || data.error) {
        setError(data.error || "Deployment failed")
      } else {
        setHistory((prev) => [
          ...prev,
          {
            repoName,
            repoUrl: data.repoUrl,
            deploymentUrl: data.deploymentUrl,
            timestamp: Date.now(),
          },
        ])
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 border rounded-md shadow-md bg-white w-full space-y-4 flex flex-col">
      <h2 className="text-lg font-bold">Deploy Builder App</h2>

      <input
        type="text"
        placeholder="GitHub Repo Name"
        value={repoName}
        onChange={(e) => setRepoName(e.target.value)}
        className="w-full border p-2 rounded"
      />

      <button
        onClick={handleDeploy}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Deploying..." : "Deploy App"}
      </button>

      {/* Live logs */}
      <div className="p-2 border rounded max-h-48 overflow-y-auto bg-gray-50 text-sm space-y-1">
        {logs.map((log, i) => (
          <div key={i}>{log}</div>
        ))}
      </div>

      {error && <p className="text-red-600">{error}</p>}

      {/* Deploy history */}
      {history.length > 0 && (
        <div>
          <h3 className="font-semibold">Deploy History</h3>
          <ul className="text-sm space-y-1">
            {history.map((h, i) => (
              <li key={i}>
                {new Date(h.timestamp).toLocaleString()}:{" "}
                <a href={h.repoUrl} target="_blank" className="text-blue-600 underline">
                  {h.repoName}
                </a>{" "}
                →{" "}
                <a
                  href={h.deploymentUrl}
                  target="_blank"
                  className="text-green-600 underline"
                >
                  Live
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

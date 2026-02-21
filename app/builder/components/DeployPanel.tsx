// DeployPanel.tsx
"use client"

import React, { useState } from "react"
import { Button } from "../../components/ui/Button"

type DeployStatus = "idle" | "exporting" | "pushing" | "deploying" | "success" | "error"

const DeployPanel: React.FC = () => {
  const [status, setStatus] = useState<DeployStatus>("idle")
  const [logs, setLogs] = useState<string[]>([])
  const [repoUrl, setRepoUrl] = useState<string | null>(null)
  const [liveUrl, setLiveUrl] = useState<string | null>(null)

  const appendLog = (msg: string) => setLogs((prev) => [...prev, msg])

  const handleDeploy = async () => {
    try {
      setStatus("exporting")
      appendLog("✅ Exporting project snapshot...")
      setStatus("pushing")
      appendLog("📤 Pushing to GitHub...")

      const res = await fetch("/api/deploy/vercel", { method: "POST" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Deployment failed")

      setRepoUrl(data.repoUrl)
      setLiveUrl(data.liveUrl)
      setStatus("success")
      appendLog("🚀 Deployment successful!")
    } catch (err: any) {
      setStatus("error")
      appendLog(`❌ Error: ${err.message || "Unknown error"}`)
    }
  }

  return (
    <div className="border rounded p-4 space-y-4 bg-gray-50">
      <h2 className="text-lg font-bold">Deploy App</h2>
      <Button onClick={handleDeploy} disabled={status !== "idle"}>
        {status === "idle" ? "Deploy" : "Deploying..."}
      </Button>

      <div className="bg-black text-white p-2 rounded h-48 overflow-y-auto">
        {logs.map((log, i) => (
          <div key={i} className="text-sm font-mono">{log}</div>
        ))}
      </div>

      {status === "success" && liveUrl && (
        <div className="text-green-600">Live app: <a href={liveUrl} target="_blank" rel="noreferrer">{liveUrl}</a></div>
      )}
    </div>
  )
}

export default DeployPanel

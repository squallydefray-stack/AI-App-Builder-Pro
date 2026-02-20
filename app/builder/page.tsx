"use client"

import { useState, useEffect } from "react"
import { useBuilderStore } from "./state/builderStore"
import Canvas from "./canvas/Canvas"
import InspectorPanel from "./components/InspectorPanel"
import PageTree from "./components/PageTree"
import DeploymentHistory from "./components/DeploymentHistory"

// LiveLogs component
function LiveLogs({ deploymentId }: { deploymentId: string }) {
  const [logs, setLogs] = useState("")

  useState(() => {
    const evtSource = new EventSource(`/api/deploy/vercel/stream?id=${deploymentId}`)
    evtSource.onmessage = (event) => {
      setLogs((prev) => prev + event.data + "\n")
    }
    evtSource.onerror = () => evtSource.close()
    return () => evtSource.close()
  })

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
  const [selectedDeployment, setSelectedDeployment] = useState<any>(null)
  const [logs, setLogs] = useState("")

  function handleSelectDeployment(d: any) {
    setSelectedDeployment(d)
    setLogs(d.logs || "No logs available")
  }

export default function BuilderPage() {
  const pages = useBuilderStore((s) => s.pages)
  const activePageId = useBuilderStore((s) => s.activePageId)

  const [isExporting, setIsExporting] = useState(false)
  const [exportResult, setExportResult] = useState<string | null>(null)
  const [deploying, setDeploying] = useState(false)
  const [deploymentId, setDeploymentId] = useState<string | null>(null)
  const [liveUrl, setLiveUrl] = useState<string | null>(null)

  async function handleExportZip() {
    try {
      setIsExporting(true)
      setExportResult(null)
      const res = await fetch("/api/export/zip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pages }),
      })
      if (!res.ok) throw new Error("Export failed")

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = url
      a.download = "ai-app-export.zip"
      a.click()
      window.URL.revokeObjectURL(url)

      setExportResult("ZIP export successful")
    } catch (err) {
      console.error(err)
      setExportResult("Export failed")
    } finally {
      setIsExporting(false)
    }
  }

  async function handleExportGithub() {
    try {
      setIsExporting(true)
      setExportResult(null)

      const res = await fetch("/api/export/github", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pages }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "GitHub export failed")

      setExportResult(`Pushed to GitHub: ${data.commitHash}`)
    } catch (err) {
      console.error(err)
      setExportResult("GitHub export failed")
    } finally {
      setIsExporting(false)
    }
  }

 const [deployments, setDeployments] = useState<Deployment[]>([])

// update handleDeployVercel:
async function handleDeployVercel() {
  try {
    setDeploying(true)
    setDeploymentId(null)
    setLiveUrl(null)

    const res = await fetch("/api/deploy/vercel", { method: "POST" })
    const data = await res.json()
    if (data.error) throw new Error(data.error)

    const newDeployment = {
      id: data.deploymentId,
      liveUrl: data.liveUrl,
      timestamp: new Date().toISOString(),
    }
    setDeployments([newDeployment, ...deployments])
    setDeploymentId(newDeployment.id)
    setLiveUrl(newDeployment.liveUrl)
  } catch (err: any) {
    console.error(err)
    setExportResult(`Deployment failed: ${err.message}`)
  } finally {
    setDeploying(false)
  }
}

const [deployments, setDeployments] = useState<Deployment[]>([])

useEffect(() => {
  async function loadDeployments() {
    const res = await fetch("/api/deploy/vercel/history")
    if (!res.ok) return
    const data = await res.json()
    setDeployments(data)
  }
  loadDeployments()
}, [])

  return (
  <div className="mt-4 p-2 border border-gray-700 bg-gray-900 rounded max-h-48 overflow-y-auto">
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

  
    <div className="h-screen flex bg-neutral-950 text-white">
    
    {deployments.length > 0 && (
  <DeploymentHistory
    deployments={deployments}
    onSelect={handleSelectDeployment}
  />
)}

{selectedDeployment && (
  <div className="mt-4 bg-neutral-900 p-4 rounded max-h-64 overflow-y-auto">
    <pre className="text-xs text-neutral-300 whitespace-pre-wrap">
      {logs}
    </pre>
  </div>
)}
      {deploymentId && <LiveLogs deploymentId={deploymentId} />}
        <DeploymentHistory deployments={deployments} />
        
      {/* Sidebar */}
      <div className="w-64 border-r border-neutral-800 flex flex-col">
        <div className="p-4 font-semibold text-lg border-b border-neutral-800">
          Pages
        </div>
        <PageTree />
        <div className="p-4 border-t border-neutral-800 space-y-2">
          {/* Existing export buttons */}
          <button
            onClick={handleExportZip}
            disabled={isExporting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-4 py-2 rounded-lg"
          >
            {isExporting ? "Exporting..." : "Export ZIP"}
          </button>
          <button
            onClick={handleExportGithub}
            disabled={isExporting}
            className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 px-4 py-2 rounded-lg"
          >
            {isExporting ? "Exporting..." : "Export to GitHub"}
          </button>

          {/* New Vercel deploy button */}
          <button
            onClick={handleDeployVercel}
            disabled={deploying}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 px-4 py-2 rounded-lg"
          >
            {deploying ? "Deploying..." : "Deploy to Vercel"}
          </button>

          {liveUrl && (
            <div className="text-xs text-green-400 mt-1">
              Live URL: <a href={liveUrl} target="_blank">{liveUrl}</a>
            </div>
          )}

          {exportResult && (
            <div className="text-xs text-neutral-400 mt-2">
              {exportResult}
            </div>
          )}

          {/* Live logs panel */}
          {deploymentId && <LiveLogs deploymentId={deploymentId} />}
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 overflow-hidden">
        {activePageId ? (
          <Canvas />
        ) : (
          <div className="h-full flex items-center justify-center text-neutral-500">
            Select a page to begin
          </div>
        )}
      </div>

      {/* Inspector */}
      <div className="w-80 border-l border-neutral-800">
        <InspectorPanel />
      </div>
    </div>
  )
}
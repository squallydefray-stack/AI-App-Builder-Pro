"use client"

import { useState, useEffect, useRef } from "react"
import { useBuilderStore } from "@state/builderStore"
import { supabase } from "@lib/supabaseClient"
import useAuth from "@hooks/useAuth"
import { toast, Toaster } from "react-hot-toast"
import { Button } from "@components/ui/Button"

type StepStatus = "idle" | "running" | "success" | "error"

interface DeployRecord {
  id: string
  user_id: string
  repo_name: string
  repo_url: string
  deployment_url: string
  created_at: string
}

export default function AIDeployPanel() {
  const [prompt, setPrompt] = useState("")
  const [logs, setLogs] = useState<string[]>([])
  const [liveUrl, setLiveUrl] = useState<string | null>(null)
  const { getSnapshotForExport } = useBuilderStore()
  const { user, signIn, signOut } = useAuth()
  const [repoName, setRepoName] = useState("")
  const [logs, setLogs] = useState<string[]>([])
  const [history, setHistory] = useState<DeployRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deploymentUrl, setDeploymentUrl] = useState<string | null>(null)
  const logsEndRef = useRef<HTMLDivElement | null>(null)
  const wsRef = useRef<WebSocket | null>(null)

    const appendLog = (msg: string) => setLogs((prev) => [...prev, msg])

      const handleAIDeploy = async () => {
        try {
          appendLog("🤖 Generating app from prompt...")
          const res = await fetch("/api/ai-generate", {
            method: "POST",
            body: JSON.stringify({ prompt }),
          })
          const data = await res.json()
          if (!res.ok) throw new Error(data.error || "AI deployment failed")

          appendLog("🚀 Deployment successful!")
          appendLog(`GitHub: ${data.repoUrl}`)
          appendLog(`Live: ${data.liveUrl}`)
          setLiveUrl(data.liveUrl)
        } catch (err: any) {
          appendLog(`❌ Error: ${err.message}`)
        }
      }
    
  const [stepStatus, setStepStatus] = useState({
    export: "idle" as StepStatus,
    github: "idle" as StepStatus,
    vercel: "idle" as StepStatus,
  })

  const stepOrder: (keyof typeof stepStatus)[] = ["export", "github", "vercel"]

  // -------------------------------
  // Load deploy history for current user
  // -------------------------------
  useEffect(() => {
    if (!user) return
    const fetchHistory = async () => {
      const { data, error } = await supabase
        .from("deploys")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
      if (!error && data) setHistory(data)
    }
    fetchHistory()

    // Subscribe to new deploys in real-time
    const channel = supabase
      .channel("deploys")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "deploys" },
        (payload) => {
          if (payload.new.user_id === user.id) setHistory((prev) => [payload.new, ...prev])
        }
      )
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [user])

  // -------------------------------
  // WebSocket for live deploy logs
  // -------------------------------
  useEffect(() => {
    wsRef.current = new WebSocket("ws://localhost:8081")
    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === "deploy-log") {
        const msg: string = data.message
        setLogs((prev) => [...prev, msg])
        logsEndRef.current?.scrollIntoView({ behavior: "smooth" })

        // Step-wise status updates
        if (msg.includes("Exporting project")) setStepStatus((s) => ({ ...s, export: "running" }))
        if (msg.includes("Project exported")) setStepStatus((s) => ({ ...s, export: "success" }))
        if (msg.includes("Pushing to GitHub")) setStepStatus((s) => ({ ...s, github: "running" }))
        if (msg.includes("GitHub repo created")) setStepStatus((s) => ({ ...s, github: "success" }))
        if (msg.includes("Deploying to Vercel")) setStepStatus((s) => ({ ...s, vercel: "running" }))
        if (msg.includes("App deployed at")) {
          setStepStatus((s) => ({ ...s, vercel: "success" }))
          const urlMatch = msg.match(/(https?:\/\/\S+)/)
          if (urlMatch) setDeploymentUrl(urlMatch[0])
        }

        if (msg.includes("Error") || msg.includes("❌")) setStepStatus({
          export: stepStatus.export === "success" ? "success" : "error",
          github: stepStatus.github === "success" ? "success" : "error",
          vercel: stepStatus.vercel === "success" ? "success" : "error",
        })
      }
    }
    return () => wsRef.current?.close()
  }, [])

  // -------------------------------
  // Deploy function
  // -------------------------------
  const deploy = async (retryStep?: keyof typeof stepStatus) => {
    if (!user) {
      toast.error("Sign in to deploy!")
      return
    }
    if (!repoName) {
      toast.error("Repo name required")
      return
    }

    setLoading(true)
    setError(null)
    if (!retryStep) {
      setLogs([])
      setStepStatus({ export: "idle", github: "idle", vercel: "idle" })
      setDeploymentUrl(null)
    } else {
      setStepStatus((s) => ({ ...s, [retryStep]: "idle" }))
    }

    try {
      const snapshot = getSnapshotForExport()
      const res = await fetch("/api/ai-deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoName, builderSnapshot: snapshot, retryStep }),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        setError(data.error || "Deployment failed")
        toast.error(data.error || "Deployment failed")
      }
    } catch (err: any) {
      setError(err.message)
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  // -------------------------------
  // Step Component
  // -------------------------------
  const Step = ({ name, status }: { name: string; status: StepStatus }) => {
    const colors: Record<StepStatus, string> = {
      idle: "bg-gray-300",
      running: "bg-yellow-400",
      success: "bg-green-500",
      error: "bg-red-500",
    }
    const widthPercent = status === "idle" ? 0 : status === "running" ? 50 : status === "success" ? 100 : 100
    return (
      <div className="flex flex-col mb-1">
        <div className="flex items-center justify-between mb-0.5">
          <span>{name}</span>
          {status === "error" && (
            <button
              onClick={() => deploy(name.toLowerCase() as any)}
              className="ml-2 px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
            >
              Retry
            </button>
          )}
        </div>
        <div className="h-2 w-full bg-gray-200 rounded">
          <div className={`h-2 rounded ${colors[status]}`} style={{ width: `${widthPercent}%`, transition: "width 0.3s" }} />
        </div>
                <div className="space-y-4 p-4 border rounded bg-gray-50">
                  <textarea
                    className="w-full border rounded p-2"
                    placeholder="Enter prompt for AI app generation"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                  <Button onClick={handleAIDeploy}>Generate & Deploy</Button>
                  <div className="bg-black text-white h-48 overflow-y-auto p-2 font-mono">
                    {logs.map((l, i) => (
                      <div key={i}>{l}</div>
                    ))}
                  </div>
                  {liveUrl && (
                    <div className="text-green-600">
                      Live App: <a href={liveUrl} target="_blank" rel="noreferrer">{liveUrl}</a>
                    </div>
                  )}
                </div>
    )
  }

  // -------------------------------
  // Render
  // -------------------------------
  if (!user) {
    return (
      <div className="p-4 border rounded-md shadow-md bg-white w-full flex flex-col space-y-4">
        <p className="text-center text-gray-700">Sign in to deploy your app</p>
        <button onClick={signIn} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Sign in with GitHub
        </button>
      </div>
    )
  }

  return (
    <div className="p-4 border rounded-md shadow-md bg-white w-full space-y-4 flex flex-col">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">Deploy Builder App</h2>
        <button onClick={signOut} className="px-2 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300">
          Sign Out
        </button>
      </div>

      <input
        type="text"
        placeholder="GitHub Repo Name"
        value={repoName}
        onChange={(e) => setRepoName(e.target.value)}
        className="w-full border p-2 rounded"
      />

      <button
        onClick={() => deploy()}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Deploying..." : "Deploy App"}
      </button>

      {/* Step Status */}
      <div className="flex flex-col space-y-1">
        {stepOrder.map((step) => (
          <Step key={step} name={step.charAt(0).toUpperCase() + step.slice(1)} status={stepStatus[step]} />
        ))}
      </div>

      {/* Live Logs */}
      <div className="p-2 border rounded max-h-32 overflow-y-auto bg-gray-50 text-sm space-y-1">
        {logs.map((log, i) => (
          <div key={i}>{log}</div>
        ))}
        <div ref={logsEndRef} />
      </div>

      {/* Live Iframe Preview */}
      {deploymentUrl && (
        <div id="live-preview" className="mt-2 border h-64">
          <iframe src={deploymentUrl} className="w-full h-full" title="Live Deployment Preview" />
        </div>
      )}

      {/* Deploy History */}
      {history.length > 0 && (
        <div>
          <h3 className="font-semibold">Deploy History</h3>
          <ul className="text-sm space-y-1">
            {history.map((h) => (
              <li key={h.id}>
                {new Date(h.created_at).toLocaleString()}:{" "}
                <a href={h.repo_url} target="_blank" className="text-blue-600 underline">
                  {h.repo_name}
                </a>{" "}
                →{" "}
                <a href={h.deployment_url} target="_blank" className="text-green-600 underline">
                  Live
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && <p className="text-red-600">{error}</p>}
    </div>
  )
}

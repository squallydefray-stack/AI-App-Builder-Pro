//
//  DeploymentTerminal.tsx
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/21/26.
//


"use client"

import { useEffect, useRef, useState } from "react"
import { createClient } from "@supabase/supabase-js"

interface DeploymentTerminalProps {
  deploymentId: string
}

interface DeploymentRow {
  deployment_id: string
  logs: string
  live_url: string | null
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

export default function DeploymentTerminal({ deploymentId }: DeploymentTerminalProps) {
  const [logs, setLogs] = useState<string>("")
  const [liveUrl, setLiveUrl] = useState<string | null>(null)
  const [status, setStatus] = useState<"pending" | "deploying" | "completed" | "error">("pending")
  const terminalRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom whenever logs update
  useEffect(() => {
    terminalRef.current?.scrollTo({ top: terminalRef.current.scrollHeight, behavior: "smooth" })
  }, [logs])

  useEffect(() => {
    if (!deploymentId) return

    // 1️⃣ Fetch initial deployment row
    supabase
      .from<DeploymentRow>("deployments")
      .select("*")
      .eq("deployment_id", deploymentId)
      .single()
      .then(({ data, error }) => {
        if (error) {
          setStatus("error")
          setLogs(`Error fetching deployment: ${error.message}`)
          return
        }
        setLogs(data?.logs || "")
        setLiveUrl(data?.live_url || null)
        if (data?.live_url) setStatus("completed")
        else setStatus("deploying")
      })

    // 2️⃣ Subscribe to real-time updates
    const subscription = supabase
      .from<DeploymentRow>(`deployments:deployment_id=eq.${deploymentId}`)
      .on("UPDATE", (payload) => {
        setLogs(payload.new.logs)
        if (payload.new.live_url) {
          setLiveUrl(payload.new.live_url)
          setStatus("completed")
        }
      })
      .subscribe()

    return () => {
      supabase.removeSubscription(subscription)
    }
  }, [deploymentId])

  // Terminal color based on status
  const statusColor = {
    pending: "text-yellow-400",
    deploying: "text-blue-400",
    completed: "text-green-400",
    error: "text-red-500",
  }[status]

  return (
    <div className="bg-black rounded-lg border border-neutral-800 p-4 flex flex-col h-[400px]">
      <div className="flex justify-between items-center mb-2">
        <span className={`font-semibold ${statusColor}`}>Status: {status.toUpperCase()}</span>
        {liveUrl && (
          <a
            href={`https://${liveUrl}`}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-blue-500 underline"
          >
            View Live
          </a>
        )}
      </div>
      <div
        ref={terminalRef}
        className="bg-black text-white text-sm font-mono p-2 rounded flex-1 overflow-y-auto border border-neutral-900"
      >
        {logs.split("\n").map((line, i) => (
          <div key={i} className={line.toLowerCase().includes("error") ? "text-red-500" : ""}>
            {line}
          </div>
        ))}
      </div>
    </div>
  )
}

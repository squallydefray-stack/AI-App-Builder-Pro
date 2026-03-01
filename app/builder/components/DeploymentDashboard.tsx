"use client"

import { useEffect, useState, useRef } from "react"
import { createClient } from "@supabase/supabase-js"

interface Deployment {
  deployment_id: string
  live_url: string | null
  logs: string
  created_at: string
  type?: "vercel" | "github" | "other"
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const STEP_COUNTS: Record<string, number> = {
  vercel: 12,
  github: 5,
  other: 8,
}

/* -------------------------------- */
/* UTILITIES */
/* -------------------------------- */

function detectStage(logs: string) {
  if (/install/i.test(logs)) return "Installing Dependencies"
  if (/build/i.test(logs)) return "Building Application"
  if (/deploy/i.test(logs)) return "Deploying"
  if (/ready|success/i.test(logs)) return "Completed"
  if (/error|fail/i.test(logs)) return "Failed"
  return "Initializing"
}

function calculateProgress(logs: string, type: string = "other") {
  const totalSteps = STEP_COUNTS[type] || STEP_COUNTS["other"]
  const completedSteps = logs.split("\n").filter(l =>
    /✅|Done|Compiled|Ready|Built/i.test(l)
  ).length
  return Math.min((completedSteps / totalSteps) * 100, 100)
}

function parseLogLine(line: string) {
  if (/success|✅/i.test(line)) return "text-green-400"
  if (/error|fail|❌/i.test(line)) return "text-red-500"
  if (/warn|⚠️/i.test(line)) return "text-yellow-400"
  return "text-neutral-400"
}

function getStatus(logs: string) {
  if (/error|fail/i.test(logs)) return "error"
  if (/ready|success/i.test(logs)) return "success"
  return "active"
}

/* -------------------------------- */
/* COMPONENT */
/* -------------------------------- */

export default function DeploymentDashboard() {
  const [deployments, setDeployments] = useState<Deployment[]>([])
  const [progressMap, setProgressMap] = useState<Record<string, number>>({})
  const [timers, setTimers] = useState<Record<string, number>>({})
  const terminalRefs = useRef<Record<string, HTMLDivElement>>({})

  /* Fetch initial */
  useEffect(() => {
    async function fetchDeployments() {
      const { data } = await supabase
        .from("deployments")
        .select("*")
        .order("created_at", { ascending: false })
      setDeployments(data || [])
    }
    fetchDeployments()
  }, [])

  /* Realtime updates */
  useEffect(() => {
    const subscription = supabase
      .from("deployments")
      .on("UPDATE", payload => {
        setDeployments(prev =>
          prev.map(d =>
            d.deployment_id === payload.new.deployment_id
              ? payload.new
              : d
          )
        )
      })
      .subscribe()

    return () => {
      supabase.removeSubscription(subscription)
    }
  }, [])

  /* Smooth progress animation */
  useEffect(() => {
    deployments.forEach(d => {
      const target = calculateProgress(d.logs, d.type)
      setProgressMap(prev => {
        const current = prev[d.deployment_id] || 0
        const next = current + (target - current) * 0.25
        return { ...prev, [d.deployment_id]: next }
      })
    })
  }, [deployments])

  /* Timer */
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers(prev => {
        const updated = { ...prev }
        deployments.forEach(d => {
          const status = getStatus(d.logs)
          if (status === "active") {
            updated[d.deployment_id] =
              (updated[d.deployment_id] || 0) + 1
          }
        })
        return updated
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [deployments])

  /* Auto scroll */
  useEffect(() => {
    deployments.forEach(d => {
      const el = terminalRefs.current[d.deployment_id]
      if (el) el.scrollTop = el.scrollHeight
    })
  }, [deployments])

  return (
    <div className="space-y-8 p-6">
      {deployments.map(d => {
        const progress = progressMap[d.deployment_id] || 0
        const status = getStatus(d.logs)
        const stage = detectStage(d.logs)
        const seconds = timers[d.deployment_id] || 0

        const circumference = 2 * Math.PI * 45
        const strokeDashoffset =
          circumference - (progress / 100) * circumference

        return (
          <div
            key={d.deployment_id}
            className="bg-neutral-950 border border-neutral-800 rounded-xl p-6 shadow-xl"
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-sm font-semibold text-white">
                  {d.deployment_id}
                </h2>
                <p className="text-xs text-neutral-500 mt-1">
                  {stage}
                </p>
              </div>

              {d.live_url && (
                <a
                  href={`https://${d.live_url}`}
                  target="_blank"
                  className="text-green-400 text-xs hover:underline"
                >
                  Open Live
                </a>
              )}
            </div>

            <div className="flex gap-6">
              {/* Circular Progress */}
              <div className="relative w-28 h-28">
                <svg width="120" height="120">
                  <circle
                    cx="60"
                    cy="60"
                    r="45"
                    stroke="#222"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="45"
                    stroke="url(#grad)"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                  <defs>
                    <linearGradient id="grad">
                      <stop offset="0%" stopColor="#22c55e" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>

                <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-white">
                  {Math.floor(progress)}%
                </div>
              </div>

              {/* Right Column */}
              <div className="flex-1">
                <div className="h-3 w-full bg-neutral-800 rounded overflow-hidden mb-4">
                  <div
                    className="h-3 bg-gradient-to-r from-green-500 to-cyan-400 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="text-xs text-neutral-400 mb-4">
                  ⏱ {seconds}s elapsed
                </div>

                <div
                  ref={el => {
                    if (el) terminalRefs.current[d.deployment_id] = el
                  }}
                  className="bg-black text-xs font-mono h-48 overflow-y-auto p-3 rounded-lg border border-neutral-800"
                >
                  {d.logs.split("\n").map((line, i) => (
                    <div key={i} className={parseLogLine(line)}>
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

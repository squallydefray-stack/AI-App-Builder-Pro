//
// OnboardingTasksLive.tsx
// AI-App-Builder-Pro
//

"use client"

import { useEffect, useState, useRef } from "react"
import { createClient } from "@supabase/supabase-js"
import { useBuilderStore } from "@/builder/state/builderStore"

type Task = {
  id: string
  name: string
  completed: boolean
  assigned_to: string
  logs?: string
}

type User = {
  id: string
  email: string
}

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function OnboardingTasksLive() {
  const activePageId = useBuilderStore((s) => s.activePageId)
  const [tasks, setTasks] = useState<Task[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [deploying, setDeploying] = useState(false)
  const [deploymentLogs, setDeploymentLogs] = useState<string[]>([])
  const logRef = useRef<HTMLDivElement>(null)

  // Fetch tasks and users
  useEffect(() => {
    if (!activePageId) return
    setLoading(true)

    fetch(`/api/deployments/${activePageId}/onboarding`)
      .then((res) => res.json())
      .then((data) => {
        setTasks(data.tasks || [])
        setUsers(data.users || [])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [activePageId])

  // Realtime subscription for tasks
  useEffect(() => {
    if (!activePageId) return

    const taskSub = supabase
      .from(`onboarding_tasks:deployment_id=eq.${activePageId}`)
      .on("*", (payload) => {
        setTasks((prev) => {
          switch (payload.eventType) {
            case "INSERT":
              return [...prev, payload.new]
            case "UPDATE":
              return prev.map((t) => (t.id === payload.new.id ? payload.new : t))
            case "DELETE":
              return prev.filter((t) => t.id !== payload.old.id)
            default:
              return prev
          }
        })
      })
      .subscribe()

    return () => supabase.removeSubscription(taskSub)
  }, [activePageId])

  // Auto-scroll logs
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight
    }
  }, [deploymentLogs])

  const toggleTask = async (task: Task) => {
    await fetch(`/api/onboarding/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !task.completed }),
    })
  }

  // **Trigger Vercel Deployment**
  const startDeployment = async () => {
    if (!activePageId) return
    setDeploying(true)
    setDeploymentLogs([])

    try {
      const res = await fetch("/api/deploy/vercel", { method: "POST" })
      const reader = res.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) throw new Error("No response reader")

      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        setDeploymentLogs((prev) => [...prev, chunk])
      }

      setDeploymentLogs((prev) => [...prev, "\n✅ Deployment Complete!"])
    } catch (err: any) {
      setDeploymentLogs((prev) => [...prev, `\n❌ Deployment Failed: ${err.message}`])
    } finally {
      setDeploying(false)
    }
  }

  // Group tasks by user
  const tasksByUser: Record<string, Task[]> = {}
  users.forEach((u) => (tasksByUser[u.id] = []))
  tasks.forEach((t) => {
    if (tasksByUser[t.assigned_to]) tasksByUser[t.assigned_to].push(t)
  })

  if (loading) return <div className="p-4 text-neutral-400">Loading tasks...</div>
  if (!tasks.length) return <div className="p-4 text-neutral-500">No onboarding tasks</div>

  return (
    <div className="p-4 border-t border-neutral-800 space-y-6">
      <h2 className="text-lg font-semibold">Onboarding Tasks</h2>

      <div className="flex space-x-4 overflow-x-auto">
        {users.map((user) => {
          const userTasks = tasksByUser[user.id] || []
          const completedCount = userTasks.filter((t) => t.completed).length
          const progress = userTasks.length ? (completedCount / userTasks.length) * 100 : 0

          return (
            <div key={user.id} className="flex-1 min-w-[200px] bg-neutral-900 p-3 rounded-lg">
              <h3 className="text-sm font-semibold mb-2">{user.email}</h3>

              <div className="h-2 w-full bg-neutral-800 rounded mb-3">
                <div
                  className="h-2 bg-green-500 rounded"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <ul className="space-y-2">
                {userTasks.map((task) => (
                  <li
                    key={task.id}
                    className={`p-2 rounded flex justify-between items-center ${
                      task.completed ? "bg-green-700 text-white" : "bg-neutral-800"
                    }`}
                  >
                    <span className={`text-sm ${task.completed ? "line-through" : ""}`}>
                      {task.name}
                    </span>
                    <button
                      onClick={() => toggleTask(task)}
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        task.completed
                          ? "bg-green-600 hover:bg-green-500"
                          : "bg-gray-600 hover:bg-gray-500"
                      }`}
                    >
                      {task.completed ? "Done" : "Mark Done"}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>

      {/* Deployment Panel */}
      <div className="space-y-2">
        <button
          disabled={deploying}
          onClick={startDeployment}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-white font-semibold"
        >
          {deploying ? "Deploying..." : "Start Deployment"}
        </button>

        <div className="bg-black text-green-400 font-mono p-3 rounded-lg max-h-64 overflow-y-auto">
          <div ref={logRef} className="whitespace-pre-wrap">
            {deploymentLogs.join("")}
          </div>
        </div>
      </div>
    </div>
  )
}

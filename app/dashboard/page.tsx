// app/dashboard/page.tsx
"use client"

import React, { useEffect, useState } from "react"
import { useBuilderStore } from "@store/builderStore"
import { BuilderCanvas } from "@canvas/Canvas"
import PageTree from "@builderComponents/TreeView"
import InspectorPanel from "@builderComponents/InspectorPanel"
import AIDeployPanel from "@components/AIDeployPanel"
import DeployPanel from "@builderComponents/DeployPanel"
import { runDeployment } from "@lib/deploy"

export default function DashboardPage() {
  const { activePageId, pages } = useBuilderStore()
  const [user, setUser] = useState<any>(null)
  const [logs, setLogs] = useState<string[]>([])
  const [status, setStatus] = useState<"idle" | "running" | "complete">("idle")
  const [deployResult, setDeployResult] = useState<any>(null)

  useEffect(() => {
    // Example: fetch user info from session or supabase
    setUser({ id: "demo-user" })
  }, [])

  useEffect(() => {
    if (!user) return
    fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user }),
    })
  }, [user])

  const activePage = pages.find((p) => p.id === activePageId)

  const handleDeploy = async () => {
    setLogs([])
    setStatus("running")
    const result = await runDeployment(activePageId!, (msg: string) => setLogs((prev) => [...prev, msg]))
    setDeployResult(result)
    setStatus("complete")
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* -------------------------
          Left Sidebar: Page Tree
      ------------------------- */}
      <aside className="w-64 border-r bg-white overflow-y-auto p-2">
        <h2 className="text-lg font-semibold mb-4">Pages</h2>
        <PageTree />
      </aside>

      {/* -------------------------
          Center Workspace: Canvas
      ------------------------- */}
      <main className="flex-1 relative bg-gray-100 overflow-auto">
        {activePage ? <BuilderCanvas builderSchema={{ pages }} /> : <div>Loading...</div>}
      </main>

      {/* -------------------------
          Right Sidebar: Inspector + AI Deploy
      ------------------------- */}
      <aside className="w-80 border-l bg-white overflow-y-auto p-4 flex flex-col space-y-6">
        <div className="p-6 space-y-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>

          <DeployPanel />
          <InspectorPanel />
          <AIDeployPanel />
        </div>
      </aside>
    </div>
  )
}

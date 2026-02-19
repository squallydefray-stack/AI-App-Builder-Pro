// app/dashboard/page.tsx

"use client"

import React from "react"
import Canvas from "@builder/canvas/Canvas"
import PageTree from "@builder/tree/TreeView"
import InspectorPanel from "@builder/components/InspectorPanel"
import AIDeployPanel from "@components/AIDeployPanel"
import DeployPanel from "@builder/components/DeployPanel"


export default function DashboardPage() {
    const handleDeploy = async () => {
      setLogs([])
      setStatus("running")

      const result = await runDeployment(activeProjectId, (msg) => {
        setLogs(prev => [...prev, msg])
      })

      setDeployResult(result)
      setStatus("complete")
    }
    useEffect(() => {
      if (!user) return

      fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user }),
      })
    }, [user])
    
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
        <Canvas />
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
      </aside>

    </div>
  )
}

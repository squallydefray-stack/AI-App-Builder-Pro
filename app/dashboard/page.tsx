// app/dashboard/page.tsx
"use client"

import React, { useEffect, useState } from "react"
import { BuilderCanvas } from "@canvas/Canvas"
import PageTree from "@@components/TreeView"
import { BuilderInspector } from "@@components/InspectorPanel"
import DeployPanel from "@components/DeployPanel"
import AIDeployPanel from "@components/AIDeployPanel"
import { runDeployment } from "@lib/deploy"
import { useBuilderStore } from "@state/builderStore"
import { BuilderInspector } from "@components/InspectorPanel"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createSupabaseServer()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) redirect("/login")
  const { activePageId, pages } = useBuilderStore()
  const [logs, setLogs] = useState<string[]>([])
  const [status, setStatus] = useState<string>("idle")
  const [deployResult, setDeployResult] = useState<any>(null)

  const handleDeploy = async () => {
    setLogs([])
    setStatus("running")

    const result = await runDeployment(activePageId, (msg) => {
      setLogs((prev) => [...prev, msg])
    })

    setDeployResult(result)
    setStatus("complete")
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Left Sidebar: Page Tree */}
      <aside className="w-64 border-r bg-white overflow-y-auto p-2">
        <h2 className="text-lg font-semibold mb-4">Pages</h2>
        <PageTree />
      </aside>

      {/* Center Workspace: Canvas */}
      <main className="flex-1 relative bg-gray-100 overflow-auto">
        <BuilderCanvas builderSchema={{ pages }} />
      </main>

      {/* Right Sidebar: Inspector + Deploy */}
      <aside className="w-80 border-l bg-white overflow-y-auto p-4 flex flex-col space-y-6">
        <div className="p-6 space-y-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <DeployPanel />
          <BuilderInspector />
          <AIDeployPanel />
          <>{children}</>
        </div>
      </aside>
    </div>
  )
}

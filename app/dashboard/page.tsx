// app/dashboard/page.tsx

"use client"

import { BuilderCanvas } from "@/builder/canvas/BuilderCanvas"
import { BuilderInspector } from "@/builder/components/InspectorPanel"

export default function DashboardPage() {
  return (
    <div className="flex h-screen w-full">
      <div className="flex-1 overflow-hidden">
        <BuilderCanvas />
      </div>

      <aside className="w-72 border-l bg-white">
        <BuilderInspector />
      </aside>
    </div>
  )
}

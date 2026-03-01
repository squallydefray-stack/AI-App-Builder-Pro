// app/builder/canvas/BuilderWorkspace.tsx
"use client"

import React from "react"
import { BuilderCanvas } from "@/builder/canvas/BuilderCanvas"
import { BuilderInspector } from "@/builder/components/InspectorPanel"
import PageTree from "@/builder/components/PageTree"
import { ComponentPanel } from "@/builder/components/ComponentPanel"
import { useBuilderStore } from "@/builder/state/builderStore"

export const BuilderWorkspace: React.FC = () => {
  const { pages, activePageId } = useBuilderStore()
  const activePage = pages.find((p) => p.id === activePageId)

  return (
    <div className="flex h-full w-full bg-gray-50">
      <div className="w-64 bg-gray-50 border-r flex flex-col">
        <PageTree />
        <ComponentPanel />
      </div>

      <div className="flex-1 bg-white p-4 overflow-auto">
        {activePage ? <BuilderCanvas page={activePage} multiSelect /> : <div className="text-gray-400 text-center mt-20">No page selected</div>}
      </div>

      <div className="w-80 border-l bg-white overflow-y-auto">
        <BuilderInspector />
      </div>
    </div>
  )
}

//
//  ComponentLibraryPage.tsx
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/17/26.
//


// app/builder/pages/ComponentLibraryPage.tsx
"use client"

import React from "react"
import Canvas from "../canvas/Canvas"
import InspectorPanel from "../components/InspectorPanel"
import { useBuilderStore } from "../state/builderStore"
import ComponentPanel from "../components/ComponentPanel"

export default function ComponentLibraryPage() {
  const { undo, redo } = useBuilderStore()

  return (
    <div className="flex h-screen w-full bg-gray-100 overflow-hidden">
      {/* LEFT — Component Library Panel */}
      <div className="w-64 border-r bg-white overflow-auto">
        <ComponentPanel expandedLibrary />
      </div>

      {/* CENTER — Canvas */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-2 px-4 py-2 border-b bg-white">
          <button onClick={undo} className="px-3 py-1 border rounded">Undo</button>
          <button onClick={redo} className="px-3 py-1 border rounded">Redo</button>
        </div>

        <div className="flex-1 overflow-auto flex justify-center p-4">
          <div className="bg-white min-h-[1000px] w-full shadow-xl">
            <Canvas />
          </div>
        </div>
      </div>

      {/* RIGHT — Inspector */}
      <div className="w-80 border-l bg-white overflow-auto">
        <InspectorPanel />
      </div>
    </div>
  )
}

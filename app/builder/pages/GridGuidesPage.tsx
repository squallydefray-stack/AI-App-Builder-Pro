//
//  GridGuidesPage.tsx
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/17/26.
//


// app/builder/pages/GridGuidesPage.tsx
"use client"

import React, { useState } from "react"
import Canvas from "../canvas/Canvas"
import InspectorPanel from "../components/InspectorPanel"
import { useBuilderStore } from "../state/builderStore"

export default function GridGuidesPage() {
  const { undo, redo } = useBuilderStore()
  const [showGrid, setShowGrid] = useState(true)
  const [showGuides, setShowGuides] = useState(true)

  return (
    <div className="flex h-screen w-full bg-gray-100 overflow-hidden">
      {/* LEFT — Controls */}
      <div className="w-64 border-r bg-white flex flex-col p-4 gap-4">
        <button
          onClick={() => setShowGrid((v) => !v)}
          className="px-3 py-2 bg-gray-200 rounded"
        >
          {showGrid ? "Hide Grid" : "Show Grid"}
        </button>

        <button
          onClick={() => setShowGuides((v) => !v)}
          className="px-3 py-2 bg-gray-200 rounded"
        >
          {showGuides ? "Hide Guides" : "Show Guides"}
        </button>

        <div className="flex gap-2">
          <button onClick={undo} className="px-3 py-2 bg-gray-200 rounded">Undo</button>
          <button onClick={redo} className="px-3 py-2 bg-gray-200 rounded">Redo</button>
        </div>
      </div>

      {/* CENTER — Canvas */}
      <div className="flex-1 flex flex-col overflow-auto justify-center p-4">
        <div className="bg-white min-h-[1000px] w-full shadow-xl relative">
          <Canvas showGrid={showGrid} showGuides={showGuides} />
        </div>
      </div>

      {/* RIGHT — Inspector */}
      <div className="w-80 border-l bg-white overflow-auto">
        <InspectorPanel />
      </div>
    </div>
  )
}

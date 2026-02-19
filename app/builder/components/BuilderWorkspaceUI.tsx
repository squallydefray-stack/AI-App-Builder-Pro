// BuilderWorkspaceUI.tsx
"use client"

import React from "react"
import PageTree from "./pageTree"        // PageTree for page management
import Canvas from "@builder/canvas/Canvas"
import InspectorPanel from "@builder/components/InspectorPanel"

export default function BuilderWorkspaceUI() {
  return (
    <div className="flex h-screen w-full bg-gray-100 overflow-hidden">
      {/* LEFT — Page Tree */}
      <div className="w-64 border-r border-gray-200 bg-white flex-shrink-0 overflow-y-auto">
        <PageTree />
      </div>

      {/* CENTER — Canvas */}
      <div className="flex-1 flex flex-col relative p-4">
        <Canvas />
      </div>

      {/* RIGHT — Inspector Panel */}
      <div className="w-80 border-l border-gray-200 bg-white flex-shrink-0 overflow-y-auto flex flex-col">
        <InspectorPanel />
      </div>
    </div>
  )
}

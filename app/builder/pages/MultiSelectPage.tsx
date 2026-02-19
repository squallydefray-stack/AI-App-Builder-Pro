//
//  MultiSelectPage.tsx
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/17/26.
//


// app/builder/pages/MultiSelectPage.tsx
"use client"

import React, { useEffect } from "react"
import Canvas from "../canvas/Canvas"
import InspectorPanel from "../components/InspectorPanel"
import ComponentPanel from "../components/ComponentPanel"
import { useBuilderStore } from "../state/builderStore"

export default function MultiSelectPage() {
  const {
    selectSingle,
    toggleSelect,
    selectedIds,
    undo,
    redo,
    previewMode,
    setPreviewMode,
    zoom,
    setZoom,
  } = useBuilderStore()

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes("MAC")
      const ctrl = isMac ? e.metaKey : e.ctrlKey
      if (!ctrl) return

      if (e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault()
        undo()
      }
      if ((e.key.toLowerCase() === "z" && e.shiftKey) || e.key.toLowerCase() === "y") {
        e.preventDefault()
        redo()
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [undo, redo])

  return (
    <div className="flex h-screen w-full bg-gray-100 overflow-hidden">
      <div className="w-64 border-r bg-white overflow-auto">
        <ComponentPanel multiSelect />
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-2 px-4 py-2 border-b bg-white">
          <button onClick={undo} className="px-3 py-1 border rounded">Undo</button>
          <button onClick={redo} className="px-3 py-1 border rounded">Redo</button>
          <span className="ml-4 text-sm text-gray-600">Selected: {selectedIds.length}</span>
        </div>

        <div className="flex-1 overflow-auto flex justify-center p-4">
          <div style={{ transform: `scale(${zoom})`, transformOrigin: "top center" }} className="bg-white min-h-[1000px] w-full shadow-xl">
            <Canvas multiSelect />
          </div>
        </div>
      </div>

      <div className="w-80 border-l bg-white overflow-auto">
        <InspectorPanel multiSelect />
      </div>
    </div>
  )
}

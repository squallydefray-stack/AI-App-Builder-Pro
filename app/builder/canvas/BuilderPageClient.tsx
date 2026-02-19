"use client"

import React, { useState } from "react"
import Canvas from "./canvas/Canvas"
import InspectorPanel from "./components/InspectorPanel"
import AIPlanPanel from "./components/AIPlanPanel"
import Toolbar from "./components/Toolbar"
import LeftPanelTabs from "./components/LeftPanelTabs"
import { useBuilderStore } from "./state/builderStore"
import { generateStructuredPlan } from "@lib/ai/planner"
import { generateLayoutFromPlan } from "@lib/ai/layoutGenerator"
import { fetchDataForSchema } from "@lib/ai/dataGenerator"

export default function BuilderPageClient() {
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)

  const {
    structuredPlan,
    setStructuredPlan,
    setSchema,
    undo,
    redo,
    snapshot,
    previewMode,
    setPreviewMode,
    zoom,
    setZoom,
    orientation,
    setOrientation,
  } = useBuilderStore()

  /** =========================
   * AUTOPILOT
   ========================== */
  const runAutopilot = async () => {
    if (!prompt.trim()) return
    setLoading(true)
    try {
      const plan = await generateStructuredPlan(prompt)
      setStructuredPlan(plan)
    } catch (err) {
      console.error(err)
      alert("Failed to generate AI plan")
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateLayout = async () => {
    if (!structuredPlan) return
    let schema = generateLayoutFromPlan(structuredPlan)
    try {
      schema = await fetchDataForSchema(schema)
    } catch (err) {
      console.warn("Data generator failed", err)
    }
    snapshot() // store for undo/redo
    setSchema(schema)
    setStructuredPlan(null)
  }

    // Inside BuilderPageClient useEffect
    useEffect(() => {
      const handler = (e: KeyboardEvent) => {
        if (e.ctrlKey && e.key === "[") {
          // Previous page
          const idx = pages.findIndex(p => p.id === activePageId)
          if (idx > 0) switchPage(pages[idx - 1].id)
        }
        if (e.ctrlKey && e.key === "]") {
          // Next page
          const idx = pages.findIndex(p => p.id === activePageId)
          if (idx < pages.length - 1) switchPage(pages[idx + 1].id)
        }
      }
      window.addEventListener("keydown", handler)
      return () => window.removeEventListener("keydown", handler)
    }, [pages, activePageId, switchPage])

  return (
    <div className="flex h-screen w-full bg-gray-100 overflow-hidden">

          // Toolbar.tsx (or inside BuilderPageClient top toolbar)
          <div className="ml-4 text-sm font-medium">
            Active Page: {pages.find(p => p.id === activePageId)?.name || "None"}
          </div>

      {/* LEFT — Tabs Panel */}
      <div className="w-64 border-r border-gray-200 bg-white flex-shrink-0 overflow-y-auto">
        <LeftPanelTabs />
      </div>

      {/* CENTER — Canvas & Toolbar */}
      <div className="flex-1 flex flex-col relative">

        {/* Top Toolbar */}
        <Toolbar
          onUndo={undo}
          onRedo={redo}
          onSnapshot={snapshot}
        />

        {/* Canvas */}
        <div className="flex-1 overflow-auto p-4">
          <Canvas multiSelect={true} />
        </div>
      </div>

      {/* RIGHT — Inspector Panel */}
      <div className="w-80 border-l border-gray-200 bg-white flex-shrink-0 overflow-y-auto">
        <InspectorPanel />
      </div>

      {/* AI Plan Drawer */}
      <AIPlanPanel
        plan={structuredPlan}
        onGenerate={handleGenerateLayout}
        onCancel={() => setStructuredPlan(null)}
      />

      {/* Autopilot Input Overlay */}
      <div className="absolute top-4 left-[280px] flex items-center gap-2 z-40">
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your app..."
          className="px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-[400px]"
        />
        <button
          onClick={runAutopilot}
          disabled={loading}
          className="px-4 py-2 bg-black text-white rounded hover:opacity-90 transition"
        >
          {loading ? "Planning..." : "Autopilot"}
        </button>
      </div>

      {/* Preview & Zoom Controls */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-40">
        {/* Preview Mode */}
        {(["desktop","tablet","mobile"] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setPreviewMode(mode)}
            className={`px-3 py-1 rounded text-sm ${
              previewMode === mode ? "bg-black text-white" : "bg-gray-200"
            }`}
          >
            {mode}
          </button>
        ))}

        {/* Orientation toggle for tablet/mobile */}
        {previewMode !== "desktop" && (
          <button
            onClick={() =>
              setOrientation(orientation === "portrait" ? "landscape" : "portrait")
            }
            className="px-3 py-1 rounded bg-gray-200 text-sm"
          >
            {orientation}
          </button>
        )}

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 ml-2">
          <button
            onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
            className="px-2 bg-gray-200 rounded"
          >
            −
          </button>
          <span className="text-xs w-10 text-center">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom(Math.min(2, zoom + 0.1))}
            className="px-2 bg-gray-200 rounded"
          >
            +
          </button>
        </div>
      </div>
    </div>
  )
}

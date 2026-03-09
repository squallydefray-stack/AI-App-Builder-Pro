// app/builder/page.tsx
"use client"

import React, { useState, useEffect } from "react"
import { BuilderCanvas } from "@/builder/canvas/BuilderCanvas"
import { BuilderInspector } from "@/builder/components/InspectorPanel"
import { Toolbar } from "@/builder/components/Toolbar"
import LeftPanelTabs from "@/builder/components/LeftPanelTabs"
import AIPlanPanel from "@/builder/components/AIPlanPanel"
import { useBuilderStore } from "@/builder/state/builderStore"
import { generateStructuredPlan } from "@lib/ai/planner"
import { generateLayoutFromPlan } from "@lib/ai/layoutGenerator"
import { fetchDataForSchema } from "@lib/ai/dataGenerator"
import { BuilderPage } from "@lib/exporter/schema"

export default function BuilderPageClient() {
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)

  const {
    pages,
    activePageId,
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
    switchPage,
  } = useBuilderStore()

  const activePage = pages.find((p) => p.id === activePageId)

  /* =============================
     AUTOPILOT
  ============================= */
  const runAutopilot = async () => {
    if (!prompt.trim()) return
    setLoading(true)

    try {
      const plan = await generateStructuredPlan(prompt)
      setStructuredPlan(plan)
    } catch (err) {
      // console.error(err)  // TODO: remove before release
      alert("Failed to generate AI plan")
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateLayout = async () => {
    if (!structuredPlan) return

    let pagesFromPlan: BuilderPage[] =
      generateLayoutFromPlan(structuredPlan)

    try {
      const fetchedPages = await fetchDataForSchema(pagesFromPlan)
      if (Array.isArray(fetchedPages)) {
        pagesFromPlan = fetchedPages
      }
    } catch (err) {
      // console.warn("Data generator failed", err)  // TODO: remove before release
    }

    snapshot()
    setSchema({ pages: pagesFromPlan })
    setStructuredPlan(null)
  }

  /* =============================
     KEYBOARD NAVIGATION
  ============================= */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "[") {
        const idx = pages.findIndex((p) => p.id === activePageId)
        if (idx > 0) switchPage(pages[idx - 1].id)
      }

      if (e.ctrlKey && e.key === "]") {
        const idx = pages.findIndex((p) => p.id === activePageId)
        if (idx < pages.length - 1) switchPage(pages[idx + 1].id)
      }
    }

    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [pages, activePageId, switchPage])

  return (
    <div className="flex h-screen w-full bg-gray-100 overflow-hidden">

      {/* Active Page Label */}
      <div className="ml-4 text-sm font-medium absolute top-2 left-[280px] z-40">
        Active Page: {activePage?.name || "None"}
      </div>

      {/* LEFT PANEL */}
      <div className="w-64 border-r border-gray-200 bg-white flex-shrink-0 overflow-y-auto">
        <LeftPanelTabs />
      </div>

      {/* CENTER */}
      <div className="flex-1 flex flex-col relative">
        <Toolbar onUndo={undo} onRedo={redo} onSnapshot={snapshot} />

        <div className="flex-1 overflow-auto p-4">
          {activePage ? (
            <BuilderCanvas
              page={activePage}
              multiSelect
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              No page selected
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-80 border-l border-gray-200 bg-white flex-shrink-0 overflow-y-auto">
        <BuilderInspector />
      </div>

      {/* AI PLAN */}
      <AIPlanPanel
        plan={structuredPlan}
        onGenerate={handleGenerateLayout}
        onCancel={() => setStructuredPlan(null)}
      />

      {/* AUTOPILOT INPUT */}
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

      {/* PREVIEW + ZOOM */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-40">
        {(["desktop", "tablet", "mobile"] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setPreviewMode(mode)}
            className={`px-3 py-1 rounded text-sm ${
              previewMode === mode
                ? "bg-black text-white"
                : "bg-gray-200"
            }`}
          >
            {mode}
          </button>
        ))}

        {previewMode !== "desktop" && (
          <button
            onClick={() =>
              setOrientation(
                orientation === "portrait"
                  ? "landscape"
                  : "portrait"
              )
            }
            className="px-3 py-1 rounded bg-gray-200 text-sm"
          >
            {orientation}
          </button>
        )}

        <div className="flex items-center gap-1 ml-2">
          <button
            onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
            className="px-2 bg-gray-200 rounded"
          >
            −
          </button>

          <span className="text-xs w-10 text-center">
            {Math.round(zoom * 100)}%
          </span>

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
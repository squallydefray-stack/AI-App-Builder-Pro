// app/builder/layout.tsx
"use client"

import React, { useState, useEffect } from "react"
import { useBuilderStore } from "@/builder/state/builderStore"
import { BuilderInspector } from "@/builder/components/InspectorPanel"
import { BuilderCanvas } from "@/builder/canvas/BuilderCanvas"
import { AICommandProcessor } from "@/builder/components/AIPlanPanel"
import JSZip from "jszip"

export default function BuilderLayout({ children }: { children: React.ReactNode }) {
  const {
    pages,
    activePageId,
    setActiveBreakpoint,
    activeBreakpoint,
    undo,
    redo,
    addComponentsTransactional,
    getSnapshotForExport,
  } = useBuilderStore()

  const activePage = pages.find((p) => p.id === activePageId)
  const [aiInput, setAiInput] = useState("")
  const [generatedCode, setGeneratedCode] = useState("")

  // -------------------------
  // Collaboration scaffold
  // -------------------------
  useEffect(() => {
    // placeholder for Y.js collaboration if needed
    const snapshot = getSnapshotForExport()
  }, [pages])

  // -------------------------
  // Preview width based on breakpoint
  // -------------------------
  const previewWidth =
    activeBreakpoint === "base"
      ? "100%"
      : activeBreakpoint === "tablet"
      ? 900
      : 420

  // -------------------------
  // ZIP Export
  // -------------------------
  const handleExportZIP = async () => {
    if (!activePage) return
    const zip = new JSZip()
    zip.file("README.md", "# Ultra Platinum Exported App\n")
    const blob = await zip.generateAsync({ type: "blob" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = "UltraPlatinumNextApp.zip"
    link.click()
  }

  // -------------------------
  // Vercel Deploy Scaffold
  // -------------------------
  const handleDeploy = async () => {
    const response = await fetch("/api/deploy", {
      method: "POST",
      body: JSON.stringify(getSnapshotForExport()),
    })
    if (response.ok) alert("Deployment started 🚀")
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">

      {/* ===========================
          TOP CONTROL BAR
      =========================== */}
      <div className="h-14 bg-black text-white flex items-center justify-between px-6 shadow">
        <div className="font-semibold">Ultra Platinum AI App Builder</div>

        {/* Breakpoints */}
        <div className="flex gap-2">
          {["base", "tablet", "mobile"].map((bp) => (
            <button
              key={bp}
              onClick={() => setActiveBreakpoint(bp as any)}
              className={`px-3 py-1 rounded text-sm transition ${
                activeBreakpoint === bp
                  ? "bg-blue-600"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {bp.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button onClick={undo} className="px-3 py-1 bg-gray-700 rounded">Undo</button>
          <button onClick={redo} className="px-3 py-1 bg-gray-700 rounded">Redo</button>
          <button onClick={handleExportZIP} className="px-3 py-1 bg-green-600 rounded">Export ZIP</button>
          <button onClick={handleDeploy} className="px-3 py-1 bg-purple-600 rounded">Deploy</button>
        </div>
      </div>

      {/* ===========================
          MAIN BUILDER LAYOUT
      =========================== */}
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT: Inspector */}
        <aside className="w-64 border-r bg-white overflow-y-auto">
          <BuilderInspector />
        </aside>

        {/* CENTER: Canvas */}
        <main className="flex-1 bg-gray-200 overflow-auto flex justify-center p-10">
          <div
            className="bg-white relative transition-all duration-300 shadow-xl"
            style={{ width: previewWidth, minHeight: "100%" }}
          >
            {activePage ? (
              <BuilderCanvas components={activePage.components} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No page selected
              </div>
            )}
          </div>
        </main>

        {/* RIGHT: AI Command & Live Preview */}
        <aside className="w-96 border-l bg-gray-100 p-4 overflow-y-auto">
          <h2 className="font-bold mb-2 text-lg">AI App Generator</h2>
          <textarea
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
            placeholder="Describe your full app..."
            className="w-full h-32 p-2 border rounded text-sm"
          />
          <button className="mt-2 w-full bg-blue-600 text-white py-2 rounded">
            Generate App
          </button>
          <h3 className="mt-6 font-semibold">Live Code Preview</h3>
          <pre className="mt-2 bg-black text-green-400 text-xs p-3 rounded h-64 overflow-auto">
            {generatedCode || "Generated Next.js project will appear here."}
          </pre>
        </aside>
      </div>
    </div>
  )
}

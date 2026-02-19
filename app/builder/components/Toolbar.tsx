// app/builder/components/Toolbar.tsx
"use client"

import React from "react"
import { useBuilderStore } from "../state/builderStore"

export default function Toolbar() {
  const {
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

  return (
    <div className="flex items-center gap-2 px-4 py-2 border-b bg-white shadow-sm z-10">
      {/* Undo / Redo */}
      <button
        onClick={undo}
        className="px-3 py-1 border rounded hover:bg-gray-100 transition"
      >
        Undo
      </button>
      <button
        onClick={redo}
        className="px-3 py-1 border rounded hover:bg-gray-100 transition"
      >
        Redo
      </button>
      <button
        onClick={snapshot}
        className="px-3 py-1 border rounded hover:bg-gray-100 transition"
      >
        Snapshot
      </button>

      <div className="flex-1" />

      {/* Preview Mode */}
      <div className="flex gap-2">
        {(["desktop", "tablet", "mobile"] as const).map((mode) => (
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
      </div>

      {/* Orientation toggle (tablet/mobile) */}
      {previewMode !== "desktop" && (
        <button
          onClick={() =>
            setOrientation(orientation === "portrait" ? "landscape" : "portrait")
          }
          className="px-3 py-1 rounded bg-gray-200 text-sm ml-2"
        >
          {orientation}
        </button>
      )}

      {/* Zoom Controls */}
      <div className="flex items-center gap-1 ml-4">
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
  )
}

// app/builder/components/Toolbar.tsx
"use client"

import React from "react"
import { useBuilderStore } from "@/builder/state/builderStore"
import { BuilderPage } from "@/builder/types"

interface ToolbarProps {
  onUndo?: () => void
  onRedo?: () => void
  onSnapshot?: () => BuilderPage[]
}

export function Toolbar({ onUndo, onRedo, onSnapshot }: ToolbarProps) {
  const store = useBuilderStore()
  const undoFn = onUndo ?? store.undo
  const redoFn = onRedo ?? store.redo
  const snapshotFn = onSnapshot ?? store.snapshot

  return (
    <div className="flex items-center gap-2 px-4 py-2 border-b bg-white shadow-sm z-10">
      <button onClick={undoFn} className="px-3 py-1 border rounded hover:bg-gray-100 transition">Undo</button>
      <button onClick={redoFn} className="px-3 py-1 border rounded hover:bg-gray-100 transition">Redo</button>
      <button onClick={snapshotFn} className="px-3 py-1 border rounded hover:bg-gray-100 transition">Snapshot</button>

      <div className="flex-1" />

      {(["desktop", "tablet", "mobile"] as const).map((mode) => (
        <button
          key={mode}
          onClick={() => store.setPreviewMode(mode)}
          className={`px-3 py-1 rounded text-sm ${store.previewMode === mode ? "bg-black text-white" : "bg-gray-200"}`}
        >
          {mode}
        </button>
      ))}

      {store.previewMode !== "desktop" && (
        <button
          onClick={() => store.setOrientation(store.orientation === "portrait" ? "landscape" : "portrait")}
          className="px-3 py-1 rounded bg-gray-200 text-sm ml-2"
        >
          {store.orientation}
        </button>
      )}

      <div className="flex items-center gap-1 ml-4">
        <button onClick={() => store.setZoom(Math.max(0.5, store.zoom - 0.1))} className="px-2 bg-gray-200 rounded">−</button>
        <span className="text-xs w-10 text-center">{Math.round(store.zoom * 100)}%</span>
        <button onClick={() => store.setZoom(Math.min(2, store.zoom + 0.1))} className="px-2 bg-gray-200 rounded">+</button>
      </div>
    </div>
  )
}

// app/builder/pages/ResizerPage.tsx
"use client"
import React, { useState } from "react"
import { useBuilderStore } from "@/state/builderStore"
import NodeRenderer from "./NodeRenderer"
import { ResizerOverlay } from "@/canvas/ResizerOverlay"

export default function ResizerPage() {
  const pages = useBuilderStore((s) => s.pages)
  const activePageId = useBuilderStore((s) => s.activePageId)
  const selectedIds = useBuilderStore((s) => s.selectedIds)
  const updateMultipleComponents = useBuilderStore((s) => s.updateMultipleComponents)
  const [multiSelectMode, setMultiSelectMode] = useState(false)
  const [lockAspectRatio, setLockAspectRatio] = useState(false)

  const page = pages.find((p) => p.id === activePageId)
  if (!page) return <div>Select a page to manipulate components</div>

  // Compute bounding box for selected components
  const comps = page.components.filter(c => selectedIds.includes(c.id))
  let minX = Math.min(...comps.map(c => c.layout?.x || 0))
  let minY = Math.min(...comps.map(c => c.layout?.y || 0))
  let maxX = Math.max(...comps.map(c => (c.layout?.x||0) + (c.layout?.width||0)))
  let maxY = Math.max(...comps.map(c => (c.layout?.y||0) + (c.layout?.height||0)))
  const width = maxX - minX
  const height = maxY - minY

  const snap = (value: number, grid = 10) => Math.round(value / grid) * grid

  const handleResize = (dx: number, dy: number, corner: "br" | "tr" | "bl" | "tl") => {
    const updated = page.components.map(c => {
      if (!selectedIds.includes(c.id)) return c
      const layout = { ...c.layout }
      let newWidth = layout.width || 0
      let newHeight = layout.height || 0

      switch(corner){
        case "br": newWidth += dx; newHeight += dy; break
        case "tr": newWidth += dx; newHeight -= dy; layout.y = layout.y! + dy; break
        case "bl": newWidth -= dx; newHeight += dy; layout.x = layout.x! + dx; break
        case "tl": newWidth -= dx; newHeight -= dy; layout.x = layout.x! + dx; layout.y = layout.y! + dy; break
      }

      // Lock aspect ratio if needed
      if(lockAspectRatio && layout.width && layout.height){
        const ratio = layout.width / layout.height
        if(Math.abs(dx) > Math.abs(dy)){
          newHeight = newWidth / ratio
        } else {
          newWidth = newHeight * ratio
        }
      }

      layout.width = snap(Math.max(newWidth, 20))
      layout.height = snap(Math.max(newHeight, 20))
      return { ...c, layout }
    })
    updateMultipleComponents(updated)
  }

  const renderHandle = (corner: "br" | "tr" | "bl" | "tl") => (
    <div
      className="w-3 h-3 bg-blue-500 absolute cursor-pointer"
      style={{
        left: corner.includes("r") ? width - 3 : 0,
        top: corner.includes("b") ? height - 3 : 0,
        transform: "translate(-50%, -50%)"
      }}
      onMouseDown={(e) => {
        e.preventDefault()
        const startX = e.clientX
        const startY = e.clientY

        const onMouseMove = (ev: MouseEvent) => handleResize(ev.clientX - startX, ev.clientY - startY, corner)
        const onMouseUp = () => {
          window.removeEventListener("mousemove", onMouseMove)
          window.removeEventListener("mouseup", onMouseUp)
        }
        window.addEventListener("mousemove", onMouseMove)
        window.addEventListener("mouseup", onMouseUp)
      }}
    />
  )

  return (
    <div className="w-full h-full flex flex-col p-4 gap-4">
      <h1 className="text-2xl font-bold">Resizer & Multi-Select</h1>
      <div className="flex gap-2 mb-4">
        <button
          className={`px-3 py-1 border rounded ${multiSelectMode ? "bg-gray-300" : ""}`}
          onClick={() => setMultiSelectMode(!multiSelectMode)}
        >
          Multi-Select Mode
        </button>
        <button
          className={`px-3 py-1 border rounded ${lockAspectRatio ? "bg-gray-300" : ""}`}
          onClick={() => setLockAspectRatio(!lockAspectRatio)}
        >
          Lock Aspect Ratio
        </button>
      </div>
      <div className="flex-1 border border-gray-300 rounded p-2 overflow-auto relative bg-gray-50">
        <NodeRenderer components={page.components} multiSelect={multiSelectMode} />
        {selectedIds.length > 0 && (
          <div
            style={{
              position: "absolute",
              top: minY,
              left: minX,
              width,
              height,
              border: "2px dashed #3b82f6",
            }}
          >
            {["br", "tr", "bl", "tl"].map(corner => renderHandle(corner as any))}
          </div>
        )}
      </div>
    </div>
  )
}

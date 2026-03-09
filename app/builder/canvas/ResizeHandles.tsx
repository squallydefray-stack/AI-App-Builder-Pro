// app/builder/canvas/ResizeHandles.tsx
"use client"

import React, { useState, useEffect } from "react"
import { useBuilderStore } from "@/builder/state/builderStore"
import { BuilderComponent } from "@lib/exporter/schema"
import { applySnapToComponents } from "@lib/utils/snapEngine"
import type { SnapGuide } from "@lib/utils/snapEngine"

interface ResizeHandlesProps {
  component: BuilderComponent
}



export default function ResizeHandles({ component }: ResizeHandlesProps) {
  const updateComponentProps = useBuilderStore((s) => s.updateComponentProps)
  const activeBreakpoint = useBuilderStore((s) => s.activeBreakpoint)
  const pages = useBuilderStore((s) => s.pages)
  const activePageId = useBuilderStore((s) => s.activePageId)
  const gridEnabled = useBuilderStore((s) => s.gridEnabled)
  const gridSize = useBuilderStore((s) => s.gridSize)

  const [dragging, setDragging] = useState(false)
  const [guides, setGuides] = useState<SnapGuide[]>([])

  const activePage = pages.find((p) => p.id === activePageId)
  if (!activePage) return null

  // Get all components excluding this one
  const otherComponents = activePage.components.filter((c) => c.id !== component.id)

  /* ======================================
     Mouse Move Handler for Live Resize
  ====================================== */
  const handleMouseMove = (e: MouseEvent, handle: string) => {
    if (!dragging) return

    e.preventDefault()
    const rect = e.currentTarget.getBoundingClientRect()
    let newWidth = component.propsPerBreakpoint[activeBreakpoint]?.width || 0
    let newHeight = component.propsPerBreakpoint[activeBreakpoint]?.height || 0

    const offsetX = e.movementX
    const offsetY = e.movementY

    switch (handle) {
      case "right":
        newWidth += offsetX
        break
      case "bottom":
        newHeight += offsetY
        break
      case "corner":
        newWidth += offsetX
        newHeight += offsetY
        break
      default:
        break
    }

    // Snap to grid if enabled
    if (gridEnabled) {
      newWidth = Math.round(newWidth / gridSize) * gridSize
      newHeight = Math.round(newHeight / gridSize) * gridSize
    }

    // Snap to other components
    const snapped = applySnapToComponents(
      { ...component, propsPerBreakpoint: { ...component.propsPerBreakpoint, [activeBreakpoint]: { ...component.propsPerBreakpoint[activeBreakpoint], width: newWidth, height: newHeight } } },
      otherComponents,
      activeBreakpoint,
      gridSize,
      gridEnabled
    )
    setGuides(snapped.snapGuides || [])

    updateComponentProps(component.id, { width: newWidth, height: newHeight }, activeBreakpoint)
  }

  const handleMouseUp = () => {
    setDragging(false)
    setGuides([])
  }

  useEffect(() => {
    if (dragging) {
      window.addEventListener("mouseup", handleMouseUp)
      window.addEventListener("mousemove", (e) => handleMouseMove(e, draggingHandle))
    } else {
      window.removeEventListener("mouseup", handleMouseUp)
      window.removeEventListener("mousemove", (e) => handleMouseMove(e, draggingHandle))
    }

    return () => {
      window.removeEventListener("mouseup", handleMouseUp)
      window.removeEventListener("mousemove", (e) => handleMouseMove(e, draggingHandle))
    }
  }, [dragging])

  const [draggingHandle, setDraggingHandle] = useState<string | null>(null)

  const startDrag = (handle: string) => {
    setDragging(true)
    setDraggingHandle(handle)
  }

  if (!component.propsPerBreakpoint[activeBreakpoint]) return null

  const { width = 0, height = 0, x = 0, y = 0 } = component.propsPerBreakpoint[activeBreakpoint]

  return (
    <>
      {/* Resize handles */}
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          width,
          height,
          pointerEvents: "none",
        }}
      >
        {/* Right Handle */}
        <div
          onMouseDown={() => startDrag("right")}
          style={{
            position: "absolute",
            right: -5,
            top: "50%",
            transform: "translateY(-50%)",
            width: 10,
            height: 10,
            backgroundColor: "#0070f4",
            cursor: "ew-resize",
            zIndex: 10000,
          }}
        />

        {/* Bottom Handle */}
        <div
          onMouseDown={() => startDrag("bottom")}
          style={{
            position: "absolute",
            bottom: -5,
            left: "50%",
            transform: "translateX(-50%)",
            width: 10,
            height: 10,
            backgroundColor: "#0070f4",
            cursor: "ns-resize",
            zIndex: 10000,
          }}
        />

        {/* Corner Handle */}
        <div
          onMouseDown={() => startDrag("corner")}
          style={{
            position: "absolute",
            right: -5,
            bottom: -5,
            width: 12,
            height: 12,
            backgroundColor: "#0070f4",
            cursor: "nwse-resize",
            zIndex: 10000,
          }}
        />
      </div>

      {/* Snap guides */}
      {guides.map((g, i) => (
        <div
          key={`guide-${component.id}-${i}`}
          style={{
            position: "absolute",
            left: g.x,
            top: g.y,
            width: g.width || 1,
            height: g.height || 1,
            backgroundColor: "rgba(0,112,244,0.5)",
            pointerEvents: "none",
            zIndex: 9999,
          }}
        />
      ))}
    </>
  )
}

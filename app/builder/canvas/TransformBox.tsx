//
//  TransformBox.tsx
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/17/26.
//


"use client"
import React, { useState } from "react"
import { useBuilderStore } from "../state/builderStore"
import ResizeHandles from "./ResizeHandles"
import { applyParentConstraints } from "../lib/constraintEngine"
import { computeSnap } from "../lib/smartSnapEngine"

interface TransformBoxProps {
  selectedIds: string[]
  boundingBox: { x: number; y: number; width: number; height: number }
  multiSelectMode?: boolean
  lockAspectRatio?: boolean
  gridSize?: number
}

export const TransformBox: React.FC<TransformBoxProps> = ({
  selectedIds,
  boundingBox,
  multiSelectMode,
  lockAspectRatio,
  gridSize = 10,
}) => {
  const pages = useBuilderStore((s) => s.pages)
  const activePageId = useBuilderStore((s) => s.activePageId)
  const updateMultipleComponents = useBuilderStore((s) => s.updateMultipleComponents)

  const page = pages.find((p) => p.id === activePageId)
  if (!page || selectedIds.length === 0) return null

  const [dragging, setDragging] = useState(false)
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null)

  const selectedComponents = page.components.filter((c) => selectedIds.includes(c.id))
  const otherComponents = page.components.filter((c) => !selectedIds.includes(c.id))

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setDragging(true)
    setStartPos({ x: e.clientX, y: e.clientY })

    let frameId: number

    const onMouseMove = (ev: MouseEvent) => {
      if (!startPos) return
      const dxRaw = ev.clientX - startPos.x
      const dyRaw = ev.clientY - startPos.y

      // Compute snapping for reference component
      const snap = computeSnap(selectedComponents[0], otherComponents, gridSize)
      const dx = dxRaw + snap.dx
      const dy = dyRaw + snap.dy

      // Batch update components
      const updatedComponents = selectedComponents.map((c) => {
        const layout = c.layout || {}
        let newWidth = layout.width
        let newHeight = layout.height
        let newX = (layout.x || 0) + dx
        let newY = (layout.y || 0) + dy

        if (lockAspectRatio && newWidth && newHeight) {
          const ratio = newWidth / newHeight
          newHeight = newWidth / ratio
        }

        return applyParentConstraints({ ...c, layout: { ...layout, x: newX, y: newY, width: newWidth, height: newHeight } }, layout.width, layout.height)
      })

      cancelAnimationFrame(frameId)
      frameId = requestAnimationFrame(() => {
        updateMultipleComponents(updatedComponents)
      })

      setStartPos({ x: ev.clientX, y: ev.clientY })
    }

    const onMouseUp = () => {
      setDragging(false)
      setStartPos(null)
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
      cancelAnimationFrame(frameId)
    }

    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)
  }

  return (
    <div
      style={{
        position: "absolute",
        top: boundingBox.y,
        left: boundingBox.x,
        width: boundingBox.width,
        height: boundingBox.height,
        border: "2px solid #3b82f6",
        cursor: dragging ? "grabbing" : "grab",
        pointerEvents: "auto",
        zIndex: 999,
        transition: "transform 0.1s ease",
      }}
      onMouseDown={handleMouseDown}
    >
      {selectedComponents.map((c) => (
        <ResizeHandles
          key={c.id}
          id={c.id}
          parentLayout={{ width: boundingBox.width, height: boundingBox.height }}
        />
      ))}
    </div>
  )
}

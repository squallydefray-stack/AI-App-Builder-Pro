"use client"

import React, { useEffect, useState, useCallback } from "react"
import { useBuilderStore } from "@/builder/state/builderStore"

interface MultiSelectResizerProps {
  selectedIds: string[]
  parentRef: React.RefObject<HTMLDivElement | null>
}

interface Bounds {
  left: number
  top: number
  width: number
  height: number
}

export default function MultiSelectResizer({
  selectedIds,
  parentRef,
}: MultiSelectResizerProps) {
  const updateMultipleComponents = useBuilderStore(
    (s) => s.updateMultipleComponents
  )
  const activeBreakpoint = useBuilderStore((s) => s.activeBreakpoint)

  const [bounds, setBounds] = useState<Bounds | null>(null)
  const [resizing, setResizing] = useState(false)

  // ----------------------------------------
  // Calculate Bounding Box
  // ----------------------------------------
  useEffect(() => {
    if (!parentRef.current || selectedIds.length === 0) {
      setBounds(null)
      return
    }

    const elements = selectedIds
      .map((id) =>
        parentRef.current!.querySelector(
          `[data-builder-id="${id}"]`
        ) as HTMLElement | null
      )
      .filter(Boolean) as HTMLElement[]

    if (elements.length === 0) {
      setBounds(null)
      return
    }

    const rects = elements.map((el) => el.getBoundingClientRect())
    const parentRect = parentRef.current.getBoundingClientRect()

    const left = Math.min(...rects.map((r) => r.left)) - parentRect.left
    const top = Math.min(...rects.map((r) => r.top)) - parentRect.top
    const right = Math.max(...rects.map((r) => r.right)) - parentRect.left
    const bottom = Math.max(...rects.map((r) => r.bottom)) - parentRect.top

    setBounds({
      left,
      top,
      width: right - left,
      height: bottom - top,
    })
  }, [selectedIds, parentRef])

  // ----------------------------------------
  // Resize Handler
  // ----------------------------------------
  const startResize = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      setResizing(true)

      const startX = e.clientX
      const startY = e.clientY

      const startBounds = bounds
      if (!startBounds) return

      const handleMove = (moveEvent: MouseEvent) => {
        const deltaX = moveEvent.clientX - startX
        const deltaY = moveEvent.clientY - startY

        const newWidth = Math.max(20, startBounds.width + deltaX)
        const newHeight = Math.max(20, startBounds.height + deltaY)

        updateMultipleComponents(
          selectedIds.map((id) => ({
            id,
            props: {
              width: newWidth,
              height: newHeight,
            },
          }))
        )
      }

      const handleUp = () => {
        setResizing(false)
        window.removeEventListener("mousemove", handleMove)
        window.removeEventListener("mouseup", handleUp)
      }

      window.addEventListener("mousemove", handleMove)
      window.addEventListener("mouseup", handleUp)
    },
    [bounds, selectedIds, updateMultipleComponents]
  )

  if (!bounds) return null

  return (
    <div
      style={{
        position: "absolute",
        left: bounds.left,
        top: bounds.top,
        width: bounds.width,
        height: bounds.height,
        border: "2px solid #3b82f6",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    >
      {/* Resize Handle */}
      <div
        onMouseDown={startResize}
        style={{
          position: "absolute",
          width: 12,
          height: 12,
          background: "#3b82f6",
          right: -6,
          bottom: -6,
          cursor: "nwse-resize",
          pointerEvents: "auto",
        }}
      />
    </div>
  )
}

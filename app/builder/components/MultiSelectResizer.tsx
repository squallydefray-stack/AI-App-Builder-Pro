//
//  MultiSelectResizer.tsx
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/17/26.
//


"use client"

import React, { useRef, useState, useEffect, useCallback } from "react"
import { useBuilderStore } from "@/state/builderStore"
import { BuilderComponent } from "@lib/exporter/schema"
import { applyConstraints } from "@/lib/utils/constraintSolver"
import { motion } from "framer-motion"

interface ResizerProps {
  selectedIds: string[]
  parentRef: React.RefObject<HTMLDivElement>
}

const HANDLE_SIZE = 8

export default function MultiSelectResizer({ selectedIds, parentRef }: ResizerProps) {
  const { pages, activePageId, updateMultipleComponents } = useBuilderStore()
  const page = pages.find(p => p.id === activePageId)
  const [dragging, setDragging] = useState(false)
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null)
  const [initialSizes, setInitialSizes] = useState<Record<string, { width: number; height: number }>>({})

  if (!page) return null

  // Collect current sizes for selected components
  useEffect(() => {
    if (!parentRef.current) return
    const sizes: Record<string, { width: number; height: number }> = {}
    selectedIds.forEach(id => {
      const el = parentRef.current!.querySelector<HTMLElement>(`[data-builder-id="${id}"]`)
      if (el) {
        sizes[id] = { width: el.offsetWidth, height: el.offsetHeight }
      }
    })
    setInitialSizes(sizes)
  }, [selectedIds, parentRef])

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation()
    setDragging(true)
    setStartPos({ x: e.clientX, y: e.clientY })
  }

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!dragging || !startPos || !page) return
      const deltaX = e.clientX - startPos.x
      const deltaY = e.clientY - startPos.y

      const updatedComponents = page.components.map(c => {
        if (!selectedIds.includes(c.id)) return c
        const init = initialSizes[c.id]
        if (!init) return c
        const newWidth = Math.max(10, init.width + deltaX)
        const newHeight = Math.max(10, init.height + deltaY)
        const constrained = applyConstraints(c, newWidth, newHeight)
        return { ...c, props: { ...c.props, base: { ...c.props.base, width: constrained.width, height: constrained.height } } }
      })

      updateMultipleComponents(updatedComponents)
    },
    [dragging, startPos, selectedIds, initialSizes, page, updateMultipleComponents]
  )

  const handlePointerUp = () => {
    setDragging(false)
    setStartPos(null)
  }

  useEffect(() => {
    if (dragging) {
      window.addEventListener("pointermove", handlePointerMove)
      window.addEventListener("pointerup", handlePointerUp)
    } else {
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerup", handlePointerUp)
    }
    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerup", handlePointerUp)
    }
  }, [dragging, handlePointerMove])

  // Render live bounding box + handles
  if (!parentRef.current) return null

  const boundingBox = (() => {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
    selectedIds.forEach(id => {
      const el = parentRef.current!.querySelector<HTMLElement>(`[data-builder-id="${id}"]`)
      if (el) {
        const rect = el.getBoundingClientRect()
        const parentRect = parentRef.current!.getBoundingClientRect()
        minX = Math.min(minX, rect.left - parentRect.left)
        minY = Math.min(minY, rect.top - parentRect.top)
        maxX = Math.max(maxX, rect.right - parentRect.left)
        maxY = Math.max(maxY, rect.bottom - parentRect.top)
      }
    })
    if (minX === Infinity) return null
    return { left: minX, top: minY, width: maxX - minX, height: maxY - minY }
  })()

  if (!boundingBox) return null

  return (
    <div className="absolute pointer-events-none" style={{ left: 0, top: 0, width: "100%", height: "100%" }}>
      {/* Bounding box */}
      <motion.div
        className="absolute border-2 border-blue-500 rounded pointer-events-none"
        style={{
          left: boundingBox.left,
          top: boundingBox.top,
          width: boundingBox.width,
          height: boundingBox.height,
        }}
      />

      {/* Resize handle (bottom-right) */}
      <motion.div
        onPointerDown={handlePointerDown}
        className="absolute bg-blue-500 rounded-full cursor-se-resize"
        style={{
          width: HANDLE_SIZE,
          height: HANDLE_SIZE,
          left: boundingBox.left + boundingBox.width - HANDLE_SIZE / 2,
          top: boundingBox.top + boundingBox.height - HANDLE_SIZE / 2,
        }}
      />
    </div>
  )
}

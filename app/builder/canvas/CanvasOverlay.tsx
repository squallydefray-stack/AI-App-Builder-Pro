"use client"

import React, { useEffect, useState } from "react"
import { useBuilderStore } from "../state/builderStore"

export const CanvasOverlay = () => {
  const [position, setPosition] = useState<DOMRect | null>(null)
  const selectedId = useBuilderStore((s) => s.selectedId)
  const schema = useBuilderStore((s) => s.schema)

  // Find component DOM by ID
  useEffect(() => {
    if (!selectedId) {
      setPosition(null)
      return
    }
    const el = document.getElementById(selectedId)
    if (el) setPosition(el.getBoundingClientRect())
  }, [selectedId, schema])

  if (!position) return null

  return (
    <div
      className="fixed pointer-events-none z-50"
      style={{
        top: position.top - 8,
        left: position.left - 8,
        width: position.width + 16,
        height: position.height + 16,
        borderRadius: "0.5rem",
        background: "radial-gradient(circle, rgba(253,224,71,0.7) 0%, transparent 70%)",
        filter: "blur(8px)",
        animation: "breathe 1.2s ease-in-out forwards, hueShift 2s linear infinite, trailPulse 1.5s ease-in-out forwards",
      }}
    />
  )
}

// app/builder/canvas/CanvasCollabOverlay.tsx
"use client"

import React, { useEffect, useState } from "react"
import { useBuilderStore } from "@/builder/state/builderStore"

interface OverlayPosition {
  rect: DOMRect
  color: string
  key: string
}

export const CanvasCollabOverlay: React.FC = () => {
  const collabHighlights = useBuilderStore((s) => s.collabHighlights ?? [])
  const schema = useBuilderStore((s) => s.pages)

  const [overlayPositions, setOverlayPositions] = useState<OverlayPosition[]>([])

  useEffect(() => {
    const positions: OverlayPosition[] = []

    collabHighlights.forEach((user) => {
      user.highlightedIds.forEach((id) => {
        const el = document.getElementById(id)
        if (el) {
          positions.push({
            rect: el.getBoundingClientRect(),
            color: user.color,
            key: `${user.userId}-${id}`,
          })
        }
      })
    })

    setOverlayPositions(positions)
  }, [collabHighlights, schema])

  return (
    <>
      {overlayPositions.map(({ rect, color, key }) => (
        <div
          key={key}
          className="fixed pointer-events-none z-50 breathe hue-shift"
          style={{
            top: rect.top - 6,
            left: rect.left - 6,
            width: rect.width + 12,
            height: rect.height + 12,
            borderRadius: "0.5rem",
            background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
            filter: "blur(8px)",
            animation:
              "breathe 1.2s ease-in-out forwards, hueShift 2s linear infinite, trailPulse 1.5s ease-in-out forwards",
          }}
        />
      ))}
    </>
  )
}

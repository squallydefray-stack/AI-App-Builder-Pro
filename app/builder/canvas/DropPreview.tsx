//
//  DropPreview.tsx
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/17/26.
//


// app/builder/canvas/DropPreview.tsx
"use client"
import React from "react"

interface DropPreviewProps {
  x: number
  y: number
  width: number
  height: number
  horizontal?: boolean
}

export const DropPreview: React.FC<DropPreviewProps> = ({
  x, y, width, height, horizontal = true
}) => {
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: x,
        width: horizontal ? width : 2,
        height: horizontal ? 2 : height,
        backgroundColor: "#f59e0b",
        opacity: 0.8,
        zIndex: 9999,
        transition: "all 0.1s ease",
        pointerEvents: "none",
      }}
    />
  )
}

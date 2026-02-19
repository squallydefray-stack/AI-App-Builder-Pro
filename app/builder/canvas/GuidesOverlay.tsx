//
//  GuidesOverlay.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/16/26.
//


"use client"

import React from "react"

type GuideLine = {
  type: "vertical" | "horizontal"
  position: number
}

interface GuidesOverlayProps {
  guides: GuideLine[]
}

export default function GuidesOverlay({ guides }: GuidesOverlayProps) {
  if (!guides || guides.length === 0) return null

  return (
    <div className="absolute inset-0 pointer-events-none z-50">
      {guides.map((guide, index) => {
        if (guide.type === "vertical") {
          return (
            <div
              key={index}
              className="absolute bg-blue-500 opacity-60"
              style={{
                left: guide.position,
                top: 0,
                bottom: 0,
                width: 1,
              }}
            />
          )
        }

        if (guide.type === "horizontal") {
          return (
            <div
              key={index}
              className="absolute bg-blue-500 opacity-60"
              style={{
                top: guide.position,
                left: 0,
                right: 0,
                height: 1,
              }}
            />
          )
        }

        return null
      })}
    </div>
  )
}

//
//  AlignmentGuidesLayer.tsx
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/22/26.
//


// app/builder/components/AlignmentGuidesLayer.tsx
"use client"

import React from "react"
import { useAlignmentGuides } from "@/builder/hooks/useAlignmentGuides"

export default function AlignmentGuidesLayer() {
  const { horizontalGuides, verticalGuides } = useAlignmentGuides()

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Horizontal Guides */}
      {horizontalGuides.map((g, i) => (
        <div
          key={`h-guide-${i}`}
          className="absolute bg-blue-500 opacity-50"
          style={{
            top: g.position,
            left: 0,
            width: "100%",
            height: 1,
          }}
        />
      ))}

      {/* Vertical Guides */}
      {verticalGuides.map((g, i) => (
        <div
          key={`v-guide-${i}`}
          className="absolute bg-blue-500 opacity-50"
          style={{
            left: g.position,
            top: 0,
            width: 1,
            height: "100%",
          }}
        />
      ))}
    </div>
  )
}
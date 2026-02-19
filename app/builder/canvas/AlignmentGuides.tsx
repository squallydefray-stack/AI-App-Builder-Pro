//
//  AlignmentGuides.tsx
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/17/26.
//


// app/builder/canvas/AlignmentGuides.tsx
"use client"
import React from "react"
import { GuideLine } from "../../lib/useAlignmentGuides"

interface Props {
  lines: GuideLine[]
}

export const AlignmentGuides: React.FC<Props> = ({ lines }) => {
  return (
    <>
      {lines.map((line, i) => {
        if (line.x !== undefined) {
          return <div key={`x-${i}`} style={{
            position: "absolute",
            top: 0,
            left: line.x,
            width: 1,
            height: "100%",
            backgroundColor: "red",
            zIndex: 9999,
          }}/>
        }
        if (line.y !== undefined) {
          return <div key={`y-${i}`} style={{
            position: "absolute",
            top: line.y,
            left: 0,
            width: "100%",
            height: 1,
            backgroundColor: "red",
            zIndex: 9999,
          }}/>
        }
        return null
      })}
    </>
  )
}

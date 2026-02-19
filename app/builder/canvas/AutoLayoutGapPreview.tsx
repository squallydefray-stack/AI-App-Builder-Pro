//
//  AutoLayoutGapPreview.tsx
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/17/26.
//


// app/builder/canvas/AutoLayoutGapPreview.tsx
"use client"
import React from "react"
import { BuilderComponent } from "@lib/exporter/schema"

interface Props {
  parent: BuilderComponent
}

export const AutoLayoutGapPreview: React.FC<Props> = ({ parent }) => {
  if (!parent.children || !parent.layout?.autoLayout?.enabled) return null

  const { direction, gap = 0 } = parent.layout.autoLayout

  return (
    <>
      {parent.children.map((child, i) => {
        if (i === 0) return null
        const prev = parent.children[i - 1]
        const x = direction === "row" ? (prev.layout?.x || 0) + (prev.layout?.width || 0) : parent.layout?.x
        const y = direction === "column" ? (prev.layout?.y || 0) + (prev.layout?.height || 0) : parent.layout?.y

        return (
          <div key={`gap-${child.id}`} style={{
            position: "absolute",
            top: y,
            left: x,
            width: direction === "row" ? gap : 1,
            height: direction === "column" ? gap : 1,
            backgroundColor: "blue",
            opacity: 0.5,
            zIndex: 998,
          }}/>
        )
      })}
    </>
  )
}

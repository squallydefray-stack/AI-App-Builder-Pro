// app/builder/canvas/AutoLayoutGapPreview.tsx
"use client"

import React from "react"
import { BuilderComponent, StyleProps, Breakpoint } from "@lib/exporter/schema"
import { useBuilderStore } from "@/builder/state/builderStore"

interface Props {
  parent: BuilderComponent
}

export const AutoLayoutGapPreview: React.FC<Props> = ({ parent }) => {
  const activeBreakpoint = useBuilderStore((s) => s.activeBreakpoint)

  const children = parent.children || []

  if (children.length < 2) return null
  if (!parent.layout?.autoLayout?.enabled) return null

  const { direction = "row", gap = 0 } = parent.layout.autoLayout

  // Helper: get safe numeric box coordinates for the active breakpoint
  const getBox = (c: BuilderComponent) => {
    const responsive = c.propsPerBreakpoint || {}

    const bpProps: StyleProps =
      responsive[activeBreakpoint] ?? responsive.base ?? {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      }

    return {
      x: Number(bpProps.x ?? 0),
      y: Number(bpProps.y ?? 0),
      width: Number(bpProps.width ?? 0),
      height: Number(bpProps.height ?? 0),
    }
  }

  return (
    <>
      {children.map((child, i) => {
        if (i === 0) return null // skip first child

        const prev = children[i - 1]
        const prevBox = getBox(prev)
        const currBox = getBox(child)

        // Gap position calculation (numbers only)
        const gapPosition =
          direction === "row"
            ? prevBox.x + prevBox.width
            : prevBox.y + prevBox.height

        const gapWidth = direction === "row" ? gap : currBox.width
        const gapHeight = direction === "column" ? gap : currBox.height

        return (
          <div
            key={`gap-${parent.id}-${child.id}-${i}`}
            style={{
              position: "absolute",
              top: direction === "column" ? gapPosition : 0,
              left: direction === "row" ? gapPosition : 0,
              width: gapWidth,
              height: gapHeight,
              background: "rgba(0, 112, 244, 0.3)",
              pointerEvents: "none",
              zIndex: 9998,
            }}
          />
        )
      })}
    </>
  )
}

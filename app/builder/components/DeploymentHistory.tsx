// app/builder/canvas/AutoLayoutGapPreview.tsx
"use client"
import React from "react"
import { BuilderComponent } from "@lib/exporter/schema"
import { useBuilderStore } from "@/builder/state/builderStore"

interface Props {
  parent: BuilderComponent
}

export const AutoLayoutGapPreview: React.FC<Props> = ({ parent }) => {
  if (!parent.children || !parent.layout?.autoLayout?.enabled) return null

  const { direction, gap = 0 } = parent.layout.autoLayout
  const activeBreakpoint = useBuilderStore((s) => s.activeBreakpoint)

  const getBox = (c: BuilderComponent) => {
    const props = c.propsPerBreakpoint?.[activeBreakpoint] || c.props || {}
    return {
      x: props.x || 0,
      y: props.y || 0,
      width: props.width || 100,
      height: props.height || 100,
    }
  }

  return (
    <>
      {parent.children.map((child, i) => {
        if (i === 0) return null
        const prev = parent.children[i - 1]
        const prevBox = getBox(prev)

        const x = direction === "row" ? prevBox.x + prevBox.width : getBox(parent).x
        const y = direction === "column" ? prevBox.y + prevBox.height : getBox(parent).y

        return (
          <div
            key={`gap-${child.id}`}
            style={{
              position: "absolute",
              top: y,
              left: x,
              width: direction === "row" ? gap : prevBox.width,
              height: direction === "column" ? gap : prevBox.height,
              backgroundColor: "rgba(0, 122, 255, 0.5)",
              zIndex: 998,
            }}
          />
        )
      })}
    </>
  )
}

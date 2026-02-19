//
//  VirtualizedCanvas.tsx
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/17/26.
//


// canvas/VirtualizedCanvas.tsx
"use client"

import React, { useRef, useMemo } from "react"
import { FixedSizeList as List, ListChildComponentProps } from "react-window"
import { BuilderComponent } from "@lib/exporter/schema"
import NodeRenderer from "./NodeRenderer"

interface VirtualizedCanvasProps {
  components: BuilderComponent[]
  width: number
  height: number
}

export default function VirtualizedCanvas({ components, width, height }: VirtualizedCanvasProps) {
  const Row = ({ index, style }: ListChildComponentProps) => {
    const component = components[index]
    return (
      <div style={{ ...style, padding: 2 }}>
        <NodeRenderer component={component} />
      </div>
    )
  }

  return (
    <List
      height={height}
      itemCount={components.length}
      itemSize={80} // adjust for avg component height
      width={width}
    >
      {Row}
    </List>
  )
}

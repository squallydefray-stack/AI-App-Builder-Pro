//
//  CanvasNode.tsx
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/18/26.
//


import React from "react"

interface CanvasNodeProps {
  component: any
  selected: boolean
  remoteSelections: Record<string, string[]>
  clientId: string
}

const USER_COLORS = ["#FF6B6B", "#6BCB77", "#4D96FF", "#FFD93D"]

export default function CanvasNode({ component, selected, remoteSelections, clientId }: CanvasNodeProps) {
  // Collect other users who selected this component
  const others = Object.entries(remoteSelections)
    .filter(([uid]) => uid !== clientId)
    .filter(([, ids]) => ids.includes(component.id))

  const borderColors = others.map(([,], idx) => USER_COLORS[idx % USER_COLORS.length])

  return (
    <div
      style={{
        width: component.props?.base?.width || 100,
        height: component.props?.base?.height || 100,
        left: component.props?.base?.x || 0,
        top: component.props?.base?.y || 0,
        position: "absolute",
        background: component.props?.base?.background || "#fff",
        border: selected
          ? "2px solid black"
          : borderColors.length
          ? `2px solid ${borderColors[0]}`
          : "1px solid #ccc",
        boxSizing: "border-box",
      }}
      data-component-id={component.id}
    >
      {component.name || "Component"}
    </div>
  )
}

//
//  DraggableNode.tsx
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/17/26.
//


// app/builder/components/DraggableNode.tsx
"use client"

import React from "react"
import { motion } from "framer-motion"
import { BuilderComponent } from "@lib/exporter/schema"
import { useBuilderStore } from "../state/builderStore"
import { DropZone, useCanvasDropContext } from "./DropZone"

interface DraggableNodeProps {
  component: BuilderComponent
}

export const DraggableNode: React.FC<DraggableNodeProps> = ({ component }) => {
  const { selectedIds, selectSingle, toggleSelect } = useBuilderStore()
  const { onDragMove, onDragEnd } = useCanvasDropContext()

  const isSelected = selectedIds.includes(component.id)

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (e.shiftKey) toggleSelect(component.id)
    else selectSingle(component.id)
  }

  const style = {
    width: component.props.base?.width || 100,
    height: component.props.base?.height || 100,
    backgroundColor: component.props.base?.backgroundColor || "transparent",
    border: isSelected ? "2px solid #3b82f6" : "1px solid #d1d5db",
    borderRadius: "6px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute" as const,
    top: component.props.base?.y || 0,
    left: component.props.base?.x || 0,
    cursor: "move",
  }

  return (
    <DropZone
      id={component.id}
      x={component.props.base?.x || 0}
      y={component.props.base?.y || 0}
      width={component.props.base?.width || 100}
      height={component.props.base?.height || 100}
    >
      <motion.div
        drag
        dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
        dragMomentum={false}
        style={style}
        onDrag={(e) => onDragMove?.(e)}
        onDragEnd={(e) => onDragEnd?.(e)}
        onClick={handleClick}
      >
        {component.type}
        {component.children?.map((child) => (
          <DraggableNode key={child.id} component={child} />
        ))}
      </motion.div>
    </DropZone>
  )
}

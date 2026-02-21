// app/builder/canvas/NodeRenderer.tsx
"use client"

import React from "react"
import { BuilderComponent } from "@lib/exporter/schema"
import { renderComponentJSX } from "@export/next/componentTemplates"
import { useBuilderStore } from "@state/builderStore"
import { motion } from "framer-motion"
import { useDraggable } from "@dnd-kit/core"
import { Rnd } from "react-rnd"

type NodeRendererProps = {
  component: BuilderComponent
}

export const NodeRenderer: React.FC<NodeRendererProps> = ({ component }) => {
  const { selectedIds, selectComponent, activeBreakpoint, updateComponentProps } = useBuilderStore()

  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: component.id })
  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : {}

  const props = component.propsPerBreakpoint?.[activeBreakpoint] || component.props
  const isSelected = selectedIds.includes(component.id)

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    selectComponent(component.id)
  }

  return (
    <motion.div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{ ...style }}
      className={`builder-node ${isSelected ? "ring-2 ring-blue-500" : ""}`}
      onClick={handleClick}
      layout
    >
      <Rnd
        size={{ width: props.width || 200, height: props.height || 100 }}
        position={{ x: props.x || 0, y: props.y || 0 }}
        onDragStop={(e, d) => updateComponentProps(component.id, { x: d.x, y: d.y })}
        onResizeStop={(e, dir, ref, delta, position) =>
          updateComponentProps(component.id, {
            width: parseInt(ref.style.width),
            height: parseInt(ref.style.height),
            ...position
          })
        }
        bounds="parent"
      >
        {component.children?.length
          ? component.children.map((child) => <NodeRenderer key={child.id} component={child} />)
          : renderComponentJSX({ ...component, props })}
      </Rnd>
    </motion.div>
  )
}
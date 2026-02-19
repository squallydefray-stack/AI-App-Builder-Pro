// app/builder/canvas/NodeRenderer.tsx
"use client"

import React from "react"
import { BuilderComponent } from "@lib/exporter/schema"
import { renderComponentJSX } from "@export/next/componentTemplates"
import { useBuilderStore } from "@state/builderStore"
import { motion } from "framer-motion"
import { useDraggable } from "@dnd-kit/core"

type NodeRendererProps = {
  component: BuilderComponent
}

export const NodeRenderer: React.FC<NodeRendererProps> = ({ component }) => {
  const { selectedIds, selectComponent } = useBuilderStore()
  
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: component.id })

  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : {}

  const { activeBreakpoint, updateComponentProps } = useBuilderStore()
  
  const props = component.propsPerBreakpoint?.[activeBreakpoint] || component.props

  const isSelected = selectedIds.includes(component.id)

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    selectComponent(component.id)
  }

    return (
            <Rnd
              size={{
                width: props.width || 200,
                height: props.height || 100,
              }}
              position={{ x: props.x || 0, y: props.y || 0 }}
              onDragStop={(e, d) =>
                updateComponentProps(component.id, { x: d.x, y: d.y })
              }
              onResizeStop={(e, dir, ref, delta, position) =>
                updateComponentProps(component.id, {
                  width: parseInt(ref.style.width),
                  height: parseInt(ref.style.height),
                  ...position,
                })
              }
              bounds="parent"
            >
              {component.children?.length
                ? component.children.map((child) => <NodeRenderer key={child.id} component={child} />)
                : renderComponentJSX({ ...component, props })}
            </Rnd>

        <motion.div
          ref={setNodeRef}
          {...listeners}
          {...attributes}
          style={{ ...style }}
          className={`builder-node ${isSelected ? "ring-2 ring-blue-500" : ""}`}
          onClick={handleClick}
          layout
        >
          {component.children?.length
            ? component.children.map((child) => <NodeRenderer key={child.id} component={child} />)
            : renderComponentJSX(component)}
        </motion.div>
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
              {snapLines.map((line, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: line.x ?? 0,
                    top: line.y ?? 0,
                    width: line.x ? 1 : "100%",
                    height: line.y ? 1 : "100%",
                    backgroundColor: "rgba(59, 130, 246, 0.5)"
                  }}
                />
              ))}
            </div>
      )
    }

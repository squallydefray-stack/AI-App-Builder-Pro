"use client"

import React from "react"
import { useBuilderStore } from "@/state/builderStore"
import { BuilderComponent } from "@lib/exporter/schema"

type TreeNodeProps = {
  node: BuilderComponent
  depth?: number
}

export default function TreeNode({ node, depth = 0 }: TreeNodeProps) {
  const { selectedIds, selectComponent, hoveredId, setHovered } = useBuilderStore()
  const isSelected = selectedIds.includes(node.id)
  const isHovered = hoveredId === node.id

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    selectComponent(node.id, e.metaKey || e.ctrlKey, e.shiftKey)
  }

  const handleMouseEnter = () => setHovered(node.id)
  const handleMouseLeave = () => setHovered(null)

  return (
    <div>
      <div
        className={`cursor-pointer px-2 py-1 rounded transition-all
          ${isSelected ? "bg-blue-100 font-semibold" : ""}
          ${isHovered && !isSelected ? "bg-gray-100" : ""}`}
        style={{ paddingLeft: depth * 16 }}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {node.type}
      </div>

      {node.children?.length > 0 &&
        node.children.map((child) => (
          <TreeNode key={child.id} node={child} depth={depth + 1} />
        ))}
    </div>
  )
}

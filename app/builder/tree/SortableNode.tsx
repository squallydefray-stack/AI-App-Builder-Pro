// app/builder/tree/SortableNode.tsx
"use client"

import React from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useBuilderStore } from "@/state/builderStore"

type SortableNodeProps = {
  id: string
  children: React.ReactNode
}

export default function SortableNode({ id, children }: SortableNodeProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : "auto",
  }

  const hoveredId = useBuilderStore((s) => s.hoveredId)
  const setHovered = useBuilderStore((s) => s.setHovered)
  const selectComponent = useBuilderStore((s) => s.selectComponent)
  const selectedId = useBuilderStore((s) => s.selectedId)
  const isSelected = selectedId === id
  const isHovered = hoveredId === id

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onMouseEnter={() => setHovered(id)}
      onMouseLeave={() => setHovered(null)}
      onClick={(e) => {
        e.stopPropagation()
        selectComponent(id)
      }}
      className={`
        relative
        rounded
        transition-all
        ${isSelected ? "border border-blue-500 bg-blue-50" : ""}
        ${isHovered && !isSelected ? "border border-gray-300 bg-gray-50" : ""}
        mb-1
      `}
    >
      {children}
    </div>
  )
}

// app/builder/tree/TreeView.tsx
// AiAppBuilderPro

"use client"

import React, { useState } from "react"
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  closestCenter,
} from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useBuilderStore } from "../state/builderStore"
import { flattenComponents } from "../../../lib/utils/treeHelper"
import NodeRenderer from "../canvas/NodeRenderer"
import DropZone from "../canvas/DropZone"

export default function TreeView() {
  const components = useBuilderStore((s) => s.components) || []
  const selectedIds = useBuilderStore((s) => s.selectedIds)
  const selectedId = useBuilderStore((s) => s.selectedId)
  const selectComponent = useBuilderStore((s) => s.selectComponent)
  const setHovered = useBuilderStore((s) => s.setHovered)
  const pushHistory = useBuilderStore((s) => s.pushHistory)
    const moveNode = useBuilderStore((s) => s.moveComponent)
  const setHoveredDropZone = useBuilderStore((s) => s.setHoveredDropZone)

  const [collapsed, setCollapsed] = useState<string[]>([])

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const handleDragEnd = (event: DragEndEvent) => {
    pushHistory()
    const hoveredDropZoneId = useBuilderStore.getState().hoveredDropZoneId
    if (!hoveredDropZoneId) return

    if (hoveredDropZoneId.includes("-insert-")) {
      const [parentId, , indexStr] = hoveredDropZoneId.split("-insert-")
      const index = Number(indexStr)
      selectedIds.forEach((id) => moveNode(id, parentId, index))
    } else if (hoveredDropZoneId.includes("-empty")) {
      const parentId = hoveredDropZoneId.replace("-empty", "")
      selectedIds.forEach((id) => moveNode(id, parentId, 0))
    }
  }

  const toggleCollapse = (id: string) =>
    setCollapsed((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))

  const renderNode = (node: any, depth = 0) => {
    const isCollapsed = collapsed.includes(node.id)
    const isSelected = selectedId === node.id
    return (
      <div key={node.id} style={{ paddingLeft: depth * 16 }}>
        <NodeRenderer node={node} depth={depth} breakpoint="desktop" />

        {/* Collapse toggle for children */}
        {node.children?.length > 0 && !isCollapsed && (
          <div className="ml-4">
            {node.children.map((child: any, index: number) => (
              <React.Fragment key={child.id}>
                <DropZone parentId={node.id} index={index} depth={depth + 1} />
                {renderNode(child, depth + 1)}
              </React.Fragment>
            ))}
            <DropZone parentId={node.id} index={node.children.length} depth={depth + 1} />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="w-64 border-r overflow-auto p-2">
      <h3 className="font-semibold mb-2">Component Tree</h3>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={flattenComponents(components).map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          {components.length > 0 ? (
            components.map((node) => (
              <React.Fragment key={node.id}>
                <DropZone parentId={null} index={0} depth={0} isEmpty={components.length === 0} />
                {renderNode(node, 0)}
              </React.Fragment>
            ))
          ) : (
            <DropZone parentId={null} index={0} depth={0} isEmpty />
          )}
        </SortableContext>
      </DndContext>
    </div>
  )
}

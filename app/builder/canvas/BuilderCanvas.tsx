"use client"

import React, { useEffect } from "react"
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable"
import { NodeRenderer } from "./NodeRenderer"
import { useBuilderStore } from "../state/builderStore"

export default function BuilderCanvas() {
  const schema = useBuilderStore((s) => s.schema)
  const reorderComponents = useBuilderStore((s) => s.reorderComponentsByArray)
  const moveComponentInto = useBuilderStore((s) => s.moveComponentInto)
  const undo = useBuilderStore((s) => s.undo)
  const redo = useBuilderStore((s) => s.redo)
  const setDropTarget = useBuilderStore((s) => s.setDropTarget)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        if (e.key === "z") { e.preventDefault(); undo() }
        if (e.key === "y" || (e.shiftKey && e.key === "Z")) { e.preventDefault(); redo() }
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [undo, redo])

  // Helper
  function findNode(components: any[], id: string): any | null {
    for (const c of components) {
      if (c.id === id) return c
      if (c.children) {
        const found = findNode(c.children, id)
        if (found) return found
      }
    }
    return null
  }

  function isDescendant(node: any, potentialParent: any): boolean {
    if (!potentialParent.children) return false
    for (const child of potentialParent.children) {
      if (child.id === node.id) return true
      if (isDescendant(node, child)) return true
    }
    return false
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragOver={(event) => {
        const { active, over } = event
        if (!over) { setDropTarget(null, null); return }
        const activeId = active.id as string
        const overId = over.id as string
        if (activeId === overId) { setDropTarget(null, null); return }

        const activeNode = findNode(schema.pages[0].components, activeId)
        const overNode = findNode(schema.pages[0].components, overId)
        if (!activeNode || !overNode) { setDropTarget(null, null); return }
        if (isDescendant(activeNode, overNode)) { setDropTarget(null, null); return }

        const pointerY = event.pointerY
        const overRect = over.rect
        const offsetY = pointerY - overRect.top
        const third = overRect.height / 3
        let position: "inside" | "above" | "below" = "inside"
        if (offsetY < third) position = "above"
        else if (offsetY > third * 2) position = "below"

        setDropTarget(overId, position)
      }}
      onDragEnd={(event) => {
        const { active, over } = event
        setDropTarget(null, null)
        if (!over) return
        const activeId = active.id as string
        const overId = over.id as string
        const activeNode = findNode(schema.pages[0].components, activeId)
        const overNode = findNode(schema.pages[0].components, overId)
        if (!activeNode || !overNode) return
        if (isDescendant(activeNode, overNode)) return

        const position = dropTarget.position || "inside"
        if (position === "inside") moveComponentInto(activeId, overId)
        else {
          const components = [...schema.pages[0].components]
          const oldIndex = components.findIndex(c => c.id === activeId)
          let newIndex = components.findIndex(c => c.id === overId)
          if (position === "below") newIndex += 1
          const newArray = arrayMove(components, oldIndex, newIndex)
          reorderComponents(newArray)
        }
      }}
    >
      <SortableContext
        items={schema.pages[0].components.map(c => c.id)}
        strategy={verticalListSortingStrategy}
      >
        {schema.pages[0].components.map(c => (
          <NodeRenderer key={c.id} component={c} />
        ))}
      </SortableContext>
    </DndContext>
  )
}

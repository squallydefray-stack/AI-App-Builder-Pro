// app/builder/hooks/useAlignmentGuides.ts
"use client"

import { useMemo } from "react"
import { useBuilderStore } from "@/builder/state/builderStore"
import { BuilderComponent, Breakpoint } from "@lib/exporter/schema"

export interface AlignmentGuide {
  id: string
  type: "vertical" | "horizontal"

  // Positioning
  x?: number
  y?: number

  // Optional length of the guide
  length?: number
  source?: "grid" | "parent" | "component"
}

export function useAlignmentGuides(targetId?: string): AlignmentGuide[] {
  const pages = useBuilderStore((s) => s.pages)
  const activePageId = useBuilderStore((s) => s.activePageId)
  const activeBreakpoint = useBuilderStore((s) => s.activeBreakpoint)
  const gridEnabled = useBuilderStore((s) => s.gridEnabled)
  const gridSize = useBuilderStore((s) => s.gridSize)

  const guides = useMemo(() => {
    if (!activePageId || !targetId) return []

    const page = pages.find((p) => p.id === activePageId)
    if (!page) return []

    const targetNode = findNode(page.components, targetId)
    if (!targetNode) return []

    const generated: AlignmentGuide[] = []
    const targetBox = getBox(targetNode, activeBreakpoint)

    /* ---------------- Grid Snapping ---------------- */
    if (gridEnabled) {
      const snapX = Math.round(targetBox.x / gridSize) * gridSize
      const snapY = Math.round(targetBox.y / gridSize) * gridSize
      if (Math.abs(targetBox.x - snapX) < gridSize)
        generated.push({ type: "vertical", position: snapX, source: "grid" })
      if (Math.abs(targetBox.y - snapY) < gridSize)
        generated.push({ type: "horizontal", position: snapY, source: "grid" })
    }

    /* ---------------- Snap to Other Components ---------------- */
    const otherNodes = page.components.filter((c) => c.id !== targetId)
    otherNodes.forEach((node) => {
      const nodeBox = getBox(node, activeBreakpoint)

      // Edge snapping
      if (Math.abs(nodeBox.x - targetBox.x) < 5)
        generated.push({ type: "vertical", position: nodeBox.x, source: "component" })
      if (Math.abs(nodeBox.x + nodeBox.width - (targetBox.x + targetBox.width)) < 5)
        generated.push({ type: "vertical", position: nodeBox.x + nodeBox.width, source: "component" })
      if (Math.abs(nodeBox.y - targetBox.y) < 5)
        generated.push({ type: "horizontal", position: nodeBox.y, source: "component" })
      if (Math.abs(nodeBox.y + nodeBox.height - (targetBox.y + targetBox.height)) < 5)
        generated.push({ type: "horizontal", position: nodeBox.y + nodeBox.height, source: "component" })

      // Center snapping
      const nodeCenterX = nodeBox.x + nodeBox.width / 2
      const nodeCenterY = nodeBox.y + nodeBox.height / 2
      const targetCenterX = targetBox.x + targetBox.width / 2
      const targetCenterY = targetBox.y + targetBox.height / 2

      if (Math.abs(nodeCenterX - targetCenterX) < 5)
        generated.push({ type: "vertical", position: nodeCenterX, source: "component" })
      if (Math.abs(nodeCenterY - targetCenterY) < 5)
        generated.push({ type: "horizontal", position: nodeCenterY, source: "component" })
    })

    /* ---------------- Snap to Parent ---------------- */
    if (targetNode.parentId) {
      const parent = findNode(page.components, targetNode.parentId)
      if (parent) {
        const parentBox = getBox(parent, activeBreakpoint)

        // Parent edges
        if (Math.abs(parentBox.x - targetBox.x) < 5)
          generated.push({ type: "vertical", position: parentBox.x, source: "parent" })
        if (Math.abs(parentBox.x + parentBox.width - (targetBox.x + targetBox.width)) < 5)
          generated.push({ type: "vertical", position: parentBox.x + parentBox.width, source: "parent" })
        if (Math.abs(parentBox.y - targetBox.y) < 5)
          generated.push({ type: "horizontal", position: parentBox.y, source: "parent" })
        if (Math.abs(parentBox.y + parentBox.height - (targetBox.y + targetBox.height)) < 5)
          generated.push({ type: "horizontal", position: parentBox.y + parentBox.height, source: "parent" })

        // Parent center
        const parentCenterX = parentBox.x + parentBox.width / 2
        const parentCenterY = parentBox.y + parentBox.height / 2
        const targetCenterX = targetBox.x + targetBox.width / 2
        const targetCenterY = targetBox.y + targetBox.height / 2

        if (Math.abs(parentCenterX - targetCenterX) < 5)
          generated.push({ type: "vertical", position: parentCenterX, source: "parent" })
        if (Math.abs(parentCenterY - targetCenterY) < 5)
          generated.push({ type: "horizontal", position: parentCenterY, source: "parent" })
      }
    }

    return generated
  }, [pages, activePageId, targetId, activeBreakpoint, gridEnabled, gridSize])

  return guides
}

/* ---------------- Utilities ---------------- */
function findNode(components: BuilderComponent[], id: string): BuilderComponent | null {
  for (const c of components) {
    if (c.id === id) return c
    if (c.children) {
      const found = findNode(c.children, id)
      if (found) return found
    }
  }
  return null
}

function getBox(node: BuilderComponent, bp: Breakpoint) {
  const props = node.propsPerBreakpoint?.[bp] || node.propsPerBreakpoint?.base || {}
  return {
    x: props.x || 0,
    y: props.y || 0,
    width: props.width || 0,
    height: props.height || 0,
  }
}

// lib/utils/dropPosition.ts
// AI App Builder Pro — Smart Drop Position Resolver

import { BuilderComponent } from "@/lib/exporter/schema"

export type DropResult = {
  containerId: string | null
  index: number
}

type Rect = {
  id: string
  top: number
  left: number
  width: number
  height: number
}

type Options = {
  axis?: "row" | "column"
}

/* ============================================================
   UTILITIES
============================================================ */

function getCenterY(r: Rect) {
  return r.top + r.height / 2
}

function getCenterX(r: Rect) {
  return r.left + r.width / 2
}

/* ============================================================
   MAIN DROP RESOLVER
============================================================ */

export function resolveDropPosition(
  activeId: string,
  overId: string | null,
  components: BuilderComponent[],
  elementRects: Map<string, DOMRect>,
  options?: Options
): DropResult {
  if (!overId) {
    return { containerId: null, index: components.length }
  }

  // Prevent self-drop
  if (activeId === overId) {
    return { containerId: null, index: -1 }
  }

  const axis = options?.axis ?? "column"

  // Find container
  const container = findContainer(overId, components)

  if (!container) {
    return { containerId: null, index: components.length }
  }

  const children = container.children || []

  if (children.length === 0) {
    return { containerId: container.id, index: 0 }
  }

  const childRects: Rect[] = children
    .map((child) => {
      const rect = elementRects.get(child.id)
      if (!rect) return null
      return {
        id: child.id,
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      }
    })
    .filter(Boolean) as Rect[]

  const overRect = elementRects.get(overId)
  if (!overRect) {
    return { containerId: container.id, index: children.length }
  }

  const pointerCenter =
    axis === "column"
      ? getCenterY({
          id: overId,
          top: overRect.top,
          left: overRect.left,
          width: overRect.width,
          height: overRect.height,
        })
      : getCenterX({
          id: overId,
          top: overRect.top,
          left: overRect.left,
          width: overRect.width,
          height: overRect.height,
        })

  let insertIndex = children.length

  for (let i = 0; i < childRects.length; i++) {
    const rect = childRects[i]

    const childCenter =
      axis === "column"
        ? getCenterY(rect)
        : getCenterX(rect)

    if (pointerCenter < childCenter) {
      insertIndex = i
      break
    }
  }

  return {
    containerId: container.id,
    index: insertIndex,
  }
}

/* ============================================================
   FIND CONTAINER RECURSIVELY
============================================================ */

function findContainer(
  id: string,
  components: BuilderComponent[]
): BuilderComponent | null {
  for (const comp of components) {
    if (comp.id === id) {
      if (comp.layout?.autoLayout?.enabled) {
        return comp
      }
      return comp
    }

    if (comp.children) {
      const found = findContainer(id, comp.children)
      if (found) return found
    }
  }

  return null
}

// AI App Builder Pro — Ultra Platinum Layout Engine (Enhanced for Smooth Breakpoint Transitions)

import { BuilderComponent } from "@/lib/exporter/schema"

/* ============================================================
   TYPES
============================================================ */

export type BoundingBox = {
  id: string
  x: number
  y: number
  width: number
  height: number
}

export type Guide = {
  type: "vertical" | "horizontal"
  position: number
}

export type LayoutResult = {
  updated: BuilderComponent[]
  guides: Guide[]
}

export type EngineOptions = {
  snapThreshold?: number
  gridSize?: number
  canvasWidth?: number
  canvasHeight?: number
  snapToGrid?: boolean
  animate?: boolean // NEW: enable smooth animation on layout changes
}

/* ============================================================
   INTERNAL HELPERS
============================================================ */

function getBox(component: BuilderComponent, breakpoint?: string): BoundingBox {
  const props =
    (breakpoint && component.propsPerBreakpoint[breakpoint]) ||
    component.propsPerBreakpoint.base ||
    {}

  return {
    id: component.id,
    x: Number(props.x ?? 0),
    y: Number(props.y ?? 0),
    width: Number(props.width ?? 100),
    height: Number(props.height ?? 100),
  }
}

function applyBox(
  component: BuilderComponent,
  box: BoundingBox,
  animate = false
): BuilderComponent {
  // Store animation info to use in NodeRenderer if needed
  const styleUpdate: unknown = {
    position: "absolute",
    left: box.x,
    top: box.y,
    width: box.width,
    height: box.height,
  }

  if (animate) {
    styleUpdate.transition = "all 0.25s ease"
  }

  return {
    ...component,
    style: {
      ...component.style,
      ...styleUpdate,
    },
  }
}

function snap(value: number, grid: number) {
  return Math.round(value / grid) * grid
}

/* ============================================================
   1️⃣ MULTI SELECT ALIGNMENT
============================================================ */

export function alignMultiple(
  components: BuilderComponent[],
  direction:
    | "left"
    | "right"
    | "top"
    | "bottom"
    | "center-x"
    | "center-y",
  options: EngineOptions = {}
): BuilderComponent[] {
  if (components.length === 0) return []

  const boxes = components.map((c) => getBox(c))

  const minX = Math.min(...boxes.map((b) => b.x))
  const maxX = Math.max(...boxes.map((b) => b.x + b.width))
  const minY = Math.min(...boxes.map((b) => b.y))
  const maxY = Math.max(...boxes.map((b) => b.y + b.height))

  const centerX = (minX + maxX) / 2
  const centerY = (minY + maxY) / 2

  return components.map((component) => {
    const box = getBox(component)
    switch (direction) {
      case "left": box.x = minX; break
      case "right": box.x = maxX - box.width; break
      case "top": box.y = minY; break
      case "bottom": box.y = maxY - box.height; break
      case "center-x": box.x = centerX - box.width / 2; break
      case "center-y": box.y = centerY - box.height / 2; break
    }
    return applyBox(component, box, options.animate)
  })
}

/* ============================================================
   2️⃣ LIVE RESIZE WITH GRID SNAP
============================================================ */

export function resizeWithSnap(
  component: BuilderComponent,
  width: number,
  height: number,
  options: EngineOptions = {}
): BuilderComponent {
  const { gridSize = 8, snapToGrid = true, animate = false } = options

  if (snapToGrid) {
    width = snap(width, gridSize)
    height = snap(height, gridSize)
  }

  const box = getBox(component)
  box.width = Math.max(0, width)
  box.height = Math.max(0, height)

  return applyBox(component, box, animate)
}

/* ============================================================
   3️⃣ AUTO LAYOUT ENGINE (ROW / COLUMN)
============================================================ */

export function applyAutoLayout(
  parent: BuilderComponent,
  options: EngineOptions = {}
): BuilderComponent {
  const auto = parent.layout?.autoLayout
  if (!auto?.enabled || !parent.children?.length)
    return parent

  const direction = auto.direction ?? "row"
  const gap = auto.gap ?? 0
  let offset = 0

  const updatedChildren = parent.children.map((child) => {
    const box = getBox(child)
    if (direction === "row") {
      box.x = offset
      offset += box.width + gap
    } else {
      box.y = offset
      offset += box.height + gap
    }

    return applyBox(child, box, options.animate)
  })

  return {
    ...parent,
    children: updatedChildren,
  }
}

/* ============================================================
   4️⃣ SMART SPACING DETECTION
============================================================ */

export function detectSpacing(
  components: BuilderComponent[]
): Guide[] {
  if (components.length < 2) return []

  const boxes = components
    .map(getBox)
    .sort((a, b) => a.x - b.x)

  const guides: Guide[] = []

  for (let i = 0; i < boxes.length - 1; i++) {
    const current = boxes[i]
    const next = boxes[i + 1]

    const gap =
      next.x - (current.x + current.width)

    if (gap > 0) {
      guides.push({
        type: "vertical",
        position: current.x + current.width + gap / 2,
      })
    }
  }

  return guides
}

/* ============================================================
   5️⃣ FULL CONSTRAINT ENGINE
============================================================ */

export function applyConstraints(
  component: BuilderComponent,
  parentWidth: number,
  parentHeight: number,
  options: EngineOptions = {}
): BuilderComponent {
  const constraints = component.layout?.constraints ?? []
  if (!constraints.length) return component

  const box = getBox(component)

  const hasLeft = constraints.includes("left")
  const hasRight = constraints.includes("right")
  const hasTop = constraints.includes("top")
  const hasBottom = constraints.includes("bottom")

  // Horizontal stretch
  if (hasLeft && hasRight) {
    const leftOffset = box.x
    const rightOffset = parentWidth - (box.x + box.width)
    box.width = parentWidth - leftOffset - rightOffset
  } else if (hasRight && !hasLeft) {
    const rightOffset = parentWidth - (box.x + box.width)
    box.x = parentWidth - box.width - rightOffset
  }

  // Vertical stretch
  if (hasTop && hasBottom) {
    const topOffset = box.y
    const bottomOffset = parentHeight - (box.y + box.height)
    box.height = parentHeight - topOffset - bottomOffset
  } else if (hasBottom && !hasTop) {
    const bottomOffset = parentHeight - (box.y + box.height)
    box.y = parentHeight - box.height - bottomOffset
  }

  // Centering
  if (constraints.includes("center-x")) box.x = parentWidth / 2 - box.width / 2
  if (constraints.includes("center-y")) box.y = parentHeight / 2 - box.height / 2

  box.width = Math.max(0, box.width)
  box.height = Math.max(0, box.height)

  return applyBox(component, box, options.animate)
}

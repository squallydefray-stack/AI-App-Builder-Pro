// lib/utils/layoutEngine.ts
// AI App Builder Pro — Full Figma-Level Layout Engine

import { BuilderComponent, Constraint } from "@/lib/exporter/schema"

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
}

/* ============================================================
   UTILITIES
============================================================ */

function getBox(component: BuilderComponent): BoundingBox {
  const style = component.style || {}

  return {
    id: component.id,
    x: Number(style.left ?? 0),
    y: Number(style.top ?? 0),
    width: Number(style.width ?? 100),
    height: Number(style.height ?? 100),
  }
}

function applyBox(
  component: BuilderComponent,
  box: BoundingBox
): BuilderComponent {
  return {
    ...component,
    style: {
      ...component.style,
      position: "absolute",
      left: box.x,
      top: box.y,
      width: box.width,
      height: box.height,
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
    | "center-y"
) {
  const boxes = components.map(getBox)

  const minX = Math.min(...boxes.map((b) => b.x))
  const maxX = Math.max(...boxes.map((b) => b.x + b.width))
  const minY = Math.min(...boxes.map((b) => b.y))
  const maxY = Math.max(...boxes.map((b) => b.y + b.height))

  const centerX = (minX + maxX) / 2
  const centerY = (minY + maxY) / 2

  return components.map((c) => {
    const box = getBox(c)

    switch (direction) {
      case "left":
        box.x = minX
        break
      case "right":
        box.x = maxX - box.width
        break
      case "top":
        box.y = minY
        break
      case "bottom":
        box.y = maxY - box.height
        break
      case "center-x":
        box.x = centerX - box.width / 2
        break
      case "center-y":
        box.y = centerY - box.height / 2
        break
    }

    return applyBox(c, box)
  })
}

/* ============================================================
   2️⃣ LIVE RESIZE SNAP
============================================================ */

export function resizeWithSnap(
  component: BuilderComponent,
  width: number,
  height: number,
  options: EngineOptions
): BuilderComponent {
  const { gridSize = 8, snapToGrid = true } = options

  if (snapToGrid) {
    width = snap(width, gridSize)
    height = snap(height, gridSize)
  }

  const box = getBox(component)
  box.width = width
  box.height = height

  return applyBox(component, box)
}

/* ============================================================
   3️⃣ AUTO LAYOUT AWARE SNAP
============================================================ */

export function applyAutoLayout(
  parent: BuilderComponent
): BuilderComponent {
  if (!parent.layout?.autoLayout?.enabled)
    return parent

  const direction = parent.layout.autoLayout.direction || "row"
  const gap = parent.layout.autoLayout.gap || 0

  let offset = 0

  const children = parent.children?.map((child) => {
    const box = getBox(child)

    if (direction === "row") {
      box.x = offset
      offset += box.width + gap
    } else {
      box.y = offset
      offset += box.height + gap
    }

    return applyBox(child, box)
  })

  return {
    ...parent,
    children,
  }
}

/* ============================================================
   4️⃣ SMART SPACING DETECTION
============================================================ */

export function detectSpacing(
  components: BuilderComponent[]
) {
  const boxes = components.map(getBox)
  const guides: Guide[] = []

  for (let i = 0; i < boxes.length - 1; i++) {
    const gap =
      boxes[i + 1].x - (boxes[i].x + boxes[i].width)

    if (gap > 0) {
      guides.push({
        type: "vertical",
        position:
          boxes[i].x + boxes[i].width + gap / 2,
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
  parentHeight: number
): BuilderComponent {
  if (!component.layout?.constraints) return component

  const box = getBox(component)
  const constraints = component.layout.constraints

  if (
    constraints.includes("left") &&
    constraints.includes("right")
  ) {
    box.width = parentWidth
  }

  if (
    constraints.includes("top") &&
    constraints.includes("bottom")
  ) {
    box.height = parentHeight
  }

  if (constraints.includes("center-x")) {
    box.x = parentWidth / 2 - box.width / 2
  }

  if (constraints.includes("center-y")) {
    box.y = parentHeight / 2 - box.height / 2
  }

  return applyBox(component, box)
}

//
//  alignmentEngine.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/17/26.
//


// lib/utils/alignmentEngine.ts
// AI App Builder Pro — Figma-Level Alignment Engine

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

export type AlignmentGuide = {
  type: "vertical" | "horizontal"
  position: number
}

export type AlignmentResult = {
  updated: BuilderComponent[]
  guides: AlignmentGuide[]
}

export type AlignmentOptions = {
  snapThreshold?: number
  gridSize?: number
  canvasWidth?: number
  canvasHeight?: number
  snapToGrid?: boolean
}

/* ============================================================
   INTERNAL HELPERS
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

function applyPosition(
  component: BuilderComponent,
  x: number,
  y: number
): BuilderComponent {
  return {
    ...component,
    style: {
      ...component.style,
      position: "absolute",
      left: x,
      top: y,
    },
  }
}

/* ============================================================
   GRID SNAP
============================================================ */

function snapToGrid(value: number, grid: number) {
  return Math.round(value / grid) * grid
}

/* ============================================================
   MAGNETIC SNAP (ELEMENT SNAP)
============================================================ */

function magneticSnap(
  moving: BoundingBox,
  others: BoundingBox[],
  threshold: number
): { x: number; y: number; guides: AlignmentGuide[] } {
  let newX = moving.x
  let newY = moving.y
  const guides: AlignmentGuide[] = []

  for (const box of others) {
    // Vertical alignment snap
    if (Math.abs(moving.x - box.x) < threshold) {
      newX = box.x
      guides.push({ type: "vertical", position: box.x })
    }

    if (
      Math.abs(moving.x + moving.width - (box.x + box.width)) <
      threshold
    ) {
      newX = box.x + box.width - moving.width
      guides.push({
        type: "vertical",
        position: box.x + box.width,
      })
    }

    // Horizontal alignment snap
    if (Math.abs(moving.y - box.y) < threshold) {
      newY = box.y
      guides.push({ type: "horizontal", position: box.y })
    }

    if (
      Math.abs(moving.y + moving.height - (box.y + box.height)) <
      threshold
    ) {
      newY = box.y + box.height - moving.height
      guides.push({
        type: "horizontal",
        position: box.y + box.height,
      })
    }
  }

  return { x: newX, y: newY, guides }
}

/* ============================================================
   MAIN ALIGN FUNCTION
============================================================ */

export function smartAlign(
  movingComponent: BuilderComponent,
  allComponents: BuilderComponent[],
  options: AlignmentOptions = {}
): AlignmentResult {
  const {
    snapThreshold = 6,
    gridSize = 8,
    canvasWidth = 1200,
    canvasHeight = 800,
    snapToGrid: gridEnabled = true,
  } = options

  const movingBox = getBox(movingComponent)
  const otherBoxes = allComponents
    .filter((c) => c.id !== movingComponent.id)
    .map(getBox)

  /* ---------- Magnetic Snap ---------- */
  const magnetic = magneticSnap(
    movingBox,
    otherBoxes,
    snapThreshold
  )

  let newX = magnetic.x
  let newY = magnetic.y

  /* ---------- Grid Snap ---------- */
  if (gridEnabled) {
    newX = snapToGrid(newX, gridSize)
    newY = snapToGrid(newY, gridSize)
  }

  /* ---------- Canvas Bounds ---------- */
  newX = Math.max(0, Math.min(newX, canvasWidth - movingBox.width))
  newY = Math.max(0, Math.min(newY, canvasHeight - movingBox.height))

  const updatedComponent = applyPosition(
    movingComponent,
    newX,
    newY
  )

  return {
    updated: [updatedComponent],
    guides: magnetic.guides,
  }
}

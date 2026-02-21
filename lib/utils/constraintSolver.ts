//
//  constraintSolver.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/17/26.
//


// utils/constraintSolver.ts
"use client"

import { BuilderComponent } from "@lib/exporter/schema"

export type Point = { x: number; y: number }
export type Size = { width: number; height: number }

export type ConstraintOptions = {
  snapThreshold?: number // pixels
  gridSize?: number      // for optional grid snapping
}

export interface SnapResult {
  offsetX: number
  offsetY: number
}

/**
 * Calculate snapping offsets for a component relative to other components
 * @param moving - the component being moved
 * @param others - all other components to snap to
 * @param options - snapping options
 */
export function calculateSnap(
  moving: BuilderComponent,
  others: BuilderComponent[],
  options: ConstraintOptions = {}
): SnapResult {
  const snapThreshold = options.snapThreshold ?? 12
  const gridSize = options.gridSize ?? 8

  let offsetX = 0
  let offsetY = 0

  const mx = moving.props?.x ?? 0
  const my = moving.props?.y ?? 0
  const mw = moving.props?.width ?? 100
  const mh = moving.props?.height ?? 100

  // Snap to grid first
  const gx = Math.round(mx / gridSize) * gridSize
  const gy = Math.round(my / gridSize) * gridSize
  offsetX = gx - mx
  offsetY = gy - my

  // Snap to other components edges
  for (const comp of others) {
    if (comp.id === moving.id) continue

    const cx = comp.props?.x ?? 0
    const cy = comp.props?.y ?? 0
    const cw = comp.props?.width ?? 100
    const ch = comp.props?.height ?? 100

    // Horizontal snap
    const hEdges = [
      cx - mx,          // left to left
      cx + cw - (mx + mw), // right to right
      cx - (mx + mw),   // left to right
      cx + cw - mx,     // right to left
    ]
    for (const h of hEdges) {
      if (Math.abs(h) <= snapThreshold) {
        offsetX = h
        break
      }
    }

    // Vertical snap
    const vEdges = [
      cy - my,           // top to top
      cy + ch - (my + mh), // bottom to bottom
      cy - (my + mh),    // top to bottom
      cy + ch - my,      // bottom to top
    ]
    for (const v of vEdges) {
      if (Math.abs(v) <= snapThreshold) {
        offsetY = v
        break
      }
    }
  }

  return { offsetX, offsetY }
}

/**
 * Apply snapping offsets to a component
 */
export function applySnap(
  moving: BuilderComponent,
  snap: SnapResult
): BuilderComponent {
  const newX = (moving.props?.x ?? 0) + snap.offsetX
  const newY = (moving.props?.y ?? 0) + snap.offsetY
  return {
    ...moving,
    props: { ...moving.props, x: newX, y: newY },
  }
}

//
//  smartSnapEngine.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/17/26.
//

// lib/smartSnapEngine.ts
import { BuilderComponent } from "@lib/exporter/schema"

export interface SnapResult {
  dx: number
  dy: number
}

/**
 * Snap a component to grid, parent edges, or siblings
 */
export function computeSnap(
  comp: BuilderComponent,
  siblings: BuilderComponent[],
  gridSize: number = 10
): SnapResult {
  const layout = comp.layout || {}
  let dx = 0
  let dy = 0

  const x = layout.x || 0
  const y = layout.y || 0
  const w = layout.width || 0
  const h = layout.height || 0

  // Snap to grid
  const snapX = Math.round(x / gridSize) * gridSize
  const snapY = Math.round(y / gridSize) * gridSize
  dx = snapX - x
  dy = snapY - y

  // Snap to siblings
  siblings.forEach((sibling) => {
    if (sibling.id === comp.id) return
    const sx = sibling.layout?.x || 0
    const sy = sibling.layout?.y || 0
    const sw = sibling.layout?.width || 0
    const sh = sibling.layout?.height || 0

    // Horizontal snap
    if (Math.abs(x - sx) < gridSize) dx = sx - x
    if (Math.abs(x + w - (sx + sw)) < gridSize) dx = sx + sw - (x + w)
    if (Math.abs(x + w - sx) < gridSize) dx = sx - (x + w)

    // Vertical snap
    if (Math.abs(y - sy) < gridSize) dy = sy - y
    if (Math.abs(y + h - (sy + sh)) < gridSize) dy = sy + sh - (y + h)
    if (Math.abs(y + h - sy) < gridSize) dy = sy - (y + h)
  })

  return { dx, dy }
}

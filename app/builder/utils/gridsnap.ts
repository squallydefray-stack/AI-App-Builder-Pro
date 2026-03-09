//
//  gridsnap.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/14/26.
//


// app/builder/utils/gridSnap.ts
export function snapToGrid(value: number, gridSize = 16) {
  return Math.round(value / gridSize) * gridSize
}

/**
 * Snap a component to nearby edges of sibling components
 * Returns updated { x, y } position
 */
export function snapToEdges(x: number, y: number, siblings: { x: number; y: number; width: number; height: number }[], snapThreshold = 8) {
  let snappedX = x
  let snappedY = y

  siblings.forEach((sib) => {
    // Snap left/right edges
    if (Math.abs(x - sib.x) < snapThreshold) snappedX = sib.x
    if (Math.abs(x - (sib.x + sib.width)) < snapThreshold) snappedX = sib.x + sib.width
    // Snap top/bottom edges
    if (Math.abs(y - sib.y) < snapThreshold) snappedY = sib.y
    if (Math.abs(y - (sib.y + sib.height)) < snapThreshold) snappedY = sib.y + sib.height
  })

  return { x: snappedX, y: snappedY }
}

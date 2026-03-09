//
//  snapping.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/15/26.
//


export function snapToGrid(value: number, grid = 8) {
  return Math.round(value / grid) * grid
}
export function getSnapPosition(
  x: number,
  y: number,
  otherRects: DOMRect[],
  threshold = 6
) {
  let snappedX = x
  let snappedY = y

  for (const rect of otherRects) {
    if (Math.abs(x - rect.left) < threshold) {
      snappedX = rect.left
    }

    if (Math.abs(y - rect.top) < threshold) {
      snappedY = rect.top
    }
  }

  return { x: snappedX, y: snappedY }
}

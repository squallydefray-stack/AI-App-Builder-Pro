//
//  GridSnapping.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/19/26.
//


// builder/canvas/GridSnapping.ts
export const SNAP_THRESHOLD = 12

export type SnapLine = { x?: number; y?: number }

export function getSnapOffset(
  movingRect: DOMRect,
  otherRects: DOMRect[]
): { offsetX: number; offsetY: number } {
  let offsetX = 0
  let offsetY = 0

  otherRects.forEach((rect) => {
    const dx = rect.left - movingRect.left
    const dy = rect.top - movingRect.top

    if (Math.abs(dx) < SNAP_THRESHOLD) offsetX = dx
    if (Math.abs(dy) < SNAP_THRESHOLD) offsetY = dy
  })

  return { offsetX, offsetY }
}

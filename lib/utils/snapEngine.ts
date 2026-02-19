//
//  snapEngine.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/17/26.
//


// lib/utils/snapEngine.ts
export interface SnapLine {
  x?: number
  y?: number
}

export function calculateSnapLines(
  movingRect: DOMRect,
  staticRects: DOMRect[],
  threshold = 8
): SnapLine[] {
  const snaps: SnapLine[] = []

  staticRects.forEach((rect) => {
    // Snap left/right edges
    if (Math.abs(movingRect.left - rect.left) <= threshold) snaps.push({ x: rect.left })
    if (Math.abs(movingRect.right - rect.right) <= threshold) snaps.push({ x: rect.right })

    // Snap top/bottom edges
    if (Math.abs(movingRect.top - rect.top) <= threshold) snaps.push({ y: rect.top })
    if (Math.abs(movingRect.bottom - rect.bottom) <= threshold) snaps.push({ y: rect.bottom })

    // Snap centers
    if (Math.abs(movingRect.left + movingRect.width / 2 - (rect.left + rect.width / 2)) <= threshold)
      snaps.push({ x: rect.left + rect.width / 2 })
    if (Math.abs(movingRect.top + movingRect.height / 2 - (rect.top + rect.height / 2)) <= threshold)
      snaps.push({ y: rect.top + rect.height / 2 })
  })

  return snaps
}

//
//  snapEngine.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/17/26.
//


// lib/layout/snapEngine.ts

export function getSnapPosition(
  currentX: number,
  currentY: number,
  others: { x: number; y: number }[],
  threshold = 8
) {
  let snapX = currentX
  let snapY = currentY

  for (const other of others) {
    if (Math.abs(currentX - other.x) < threshold) {
      snapX = other.x
    }

    if (Math.abs(currentY - other.y) < threshold) {
      snapY = other.y
    }
  }

  return { x: snapX, y: snapY }
}

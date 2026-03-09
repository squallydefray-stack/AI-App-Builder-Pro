//
//  gridSnap.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/23/26.
//


// lib/utils/gridSnap.ts

export function snapToGrid(
  value: number,
  gridSize: number
): number {
  return Math.round(value / gridSize) * gridSize
}
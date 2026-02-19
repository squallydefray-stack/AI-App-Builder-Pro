//
//  layoutResolver.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/12/26.
//


// lib/drag/layoutResolver.ts

import { getRectRegistry } from "./rectRegistry"

export type LayoutDirection = "row" | "column"

export function resolveInsertIndex(
  parentId: string,
  pointer: { x: number; y: number },
  direction: LayoutDirection
): number {
  const rects = getRectRegistry(parentId)
  if (!rects || rects.length === 0) return 0

  for (let i = 0; i < rects.length; i++) {
    const rect = rects[i]

    const midpoint =
      direction === "row"
        ? rect.left + rect.width / 2
        : rect.top + rect.height / 2

    const pointerValue =
      direction === "row" ? pointer.x : pointer.y

    if (pointerValue < midpoint) {
      return i
    }
  }

  return rects.length
}

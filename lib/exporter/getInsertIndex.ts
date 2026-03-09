//
//  getInsertIndex.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/12/26.
//


import { getContainerChildrenRects } from "./rectRegistry"

export function getInsertIndex(
  containerId: string,
  pointerY: number
) {
  const rects = getContainerChildrenRects(containerId)

  for (let i = 0; i < rects.length; i++) {
    const rect = rects[i]
    const midpoint = rect.top + rect.height / 2

    if (pointerY < midpoint) {
      return i
    }
  }

  return rects.length
}

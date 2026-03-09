//
//  insertResolver.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/17/26.
//


// lib/dnd/insertResolver.ts

export function resolveInsertIndex(
  mouseY: number,
  childrenRects: DOMRect[]
): number {
  for (let i = 0; i < childrenRects.length; i++) {
    const rect = childrenRects[i]
    if (mouseY < rect.top + rect.height / 2) {
      return i
    }
  }
  return childrenRects.length
}

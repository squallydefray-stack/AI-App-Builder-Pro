//
//  rectRegistry.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/12/26.
//


// lib/drag/rectRegistry.ts

const registry = new Map<string, DOMRect[]>()

export function registerChildRect(
  parentId: string,
  rect: DOMRect
) {
  const list = registry.get(parentId) ?? []
  registry.set(parentId, [...list, rect])
}

export function clearParentRects(parentId: string) {
  registry.delete(parentId)
}

export function getRectRegistry(parentId: string) {
  return registry.get(parentId)
}

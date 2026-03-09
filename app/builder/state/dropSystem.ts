//
//  dropSyatem.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/17/26.
//


"use client"

import { BuilderComponent } from "@lib/exporter/schema"

/**
 * Inserts a component at the correct index inside the target container.
 */
export function insertComponent(
  container: BuilderComponent[],
  dragged: BuilderComponent,
  overId?: string
): BuilderComponent[] {
  if (!overId) return [...container, dragged]

  const newTree: BuilderComponent[] = []
  let inserted = false

  container.forEach((c) => {
    if (c.id === overId) {
      newTree.push(dragged)
      inserted = true
    }
    newTree.push(c)

    if (c.children) {
      c.children = insertComponent(c.children, dragged, overId)
    }
  })

  if (!inserted) newTree.push(dragged)
  return newTree
}

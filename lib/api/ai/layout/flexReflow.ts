//
//  flexReflow.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/16/26.
//


import { BuilderComponent } from "@/lib/exporter/schema"

export function autoReflowFlex(
  parent: BuilderComponent,
  draggedId: string,
  targetIndex: number
) {
  if (!parent.children) return parent

  const updated = [...parent.children]
  const currentIndex = updated.findIndex(c => c.id === draggedId)

  if (currentIndex === -1) return parent

  const [dragged] = updated.splice(currentIndex, 1)
  updated.splice(targetIndex, 0, dragged)

  return {
    ...parent,
    children: updated
  }
}

//
//  layoutOptimizer.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/17/26.
//


// lib/ai/layoutOptimizer.ts

import { BuilderComponent } from "@lib/exporter/schema"

export function optimizeLayoutTree(
  components: BuilderComponent[]
): BuilderComponent[] {
  return components.map(component => {
    let updated = { ...component }

    // Auto-enable autoLayout if container has children
    if (
      component.children?.length &&
      !component.layout?.autoLayout?.enabled
    ) {
      updated.layout = {
        ...component.layout,
        autoLayout: {
          enabled: true,
          direction: "column",
          gap: 16,
          justify: "start",
          align: "stretch",
        },
      }
    }

    // Recursively optimize children
    if (component.children?.length) {
      updated.children = optimizeLayoutTree(component.children)
    }

    return updated
  })
}

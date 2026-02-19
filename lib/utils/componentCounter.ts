//
//  componentCounter.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/13/26.
//


// utils/componentCounter.ts
import { BuilderComponent } from "../lib/exporter/schema"

// Flatten tree to count all nodes
export const countComponents = (nodes: BuilderComponent[]): number => {
  let count = 0
  const traverse = (list: BuilderComponent[]) => {
    for (const c of list) {
      count += 1
      if (c.children?.length) traverse(c.children)
    }
  }
  traverse(nodes)
  return count
}

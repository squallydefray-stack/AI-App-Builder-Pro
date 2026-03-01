//
//  layoutCache.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/23/26.
//


// lib/layout/layoutCache.ts
// Ultra Platinum Layout Memoization

import { BuilderComponent } from "@/lib/exporter/schema"
import { solveConstraints } from "@lib/layout/constraintSolver"

type CacheKey = string
type CacheValue = { x: number; y: number; width: number; height: number }

const layoutCache = new Map<CacheKey, CacheValue>()

function hash(component: BuilderComponent): string {
  return JSON.stringify({
    id: component.id,
    style: component.style,
    constraints: component.layout?.constraints,
  })
}

export function solveWithCache(
  component: BuilderComponent,
  parentWidth: number,
  parentHeight: number
) {
  const key = hash(component)
  if (layoutCache.has(key)) return layoutCache.get(key)!

  const result = solveConstraints(component, { width: parentWidth, height: parentHeight }, "base")
  layoutCache.set(key, result)
  return result
}

export function clearLayoutCache() {
  layoutCache.clear()
}

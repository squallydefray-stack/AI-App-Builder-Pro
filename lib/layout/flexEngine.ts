//
//  flexEngine.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/24/26.
//


// lib/layout/flexEngine.ts

import { BuilderComponent, Breakpoint } from "@lib/exporter/schema"

export function applyFlexGrow(
  component: BuilderComponent,
  breakpoint: Breakpoint,
  containerSize: number
): BuilderComponent {
  if (!component.children) return component

  const totalWidth = component.children.reduce((sum, c) => {
    const p = c.propsPerBreakpoint[breakpoint]
    return sum + (p?.width || 0)
  }, 0)

  const extra = containerSize - totalWidth
  const growAmount = extra / component.children.length

  const updatedChildren = component.children.map(child => {
    const p = child.propsPerBreakpoint[breakpoint] || {}
    return {
      ...child,
      propsPerBreakpoint: {
        ...child.propsPerBreakpoint,
        [breakpoint]: {
          ...p,
          width: (p.width || 0) + growAmount,
        },
      },
    }
  })

  return {
    ...component,
    children: updatedChildren,
  }
}

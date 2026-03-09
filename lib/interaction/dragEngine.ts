//
//  dragEngine.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/24/26.
//


// lib/interaction/dragEngine.ts

import { BuilderComponent, Breakpoint } from "@lib/exporter/schema"
import { applySnapToComponents } from "@lib/snap/snapEngine"

const RESISTANCE_DISTANCE = 6

export function applySmartDrag(
  component: BuilderComponent,
  dx: number,
  dy: number,
  all: BuilderComponent[],
  breakpoint: Breakpoint
): BuilderComponent {
  const props = component.propsPerBreakpoint[breakpoint] || {}

  let newX = (props.x || 0) + dx
  let newY = (props.y || 0) + dy

  // Resistance near zero edges
  if (Math.abs(newX) < RESISTANCE_DISTANCE) newX = 0
  if (Math.abs(newY) < RESISTANCE_DISTANCE) newY = 0

  const updated = {
    ...component,
    propsPerBreakpoint: {
      ...component.propsPerBreakpoint,
      [breakpoint]: {
        ...props,
        x: newX,
        y: newY,
      },
    },
  }

  return applySnapToComponents(updated, all, breakpoint)
}

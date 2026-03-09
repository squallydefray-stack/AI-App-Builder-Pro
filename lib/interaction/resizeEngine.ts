// lib/interaction/resizeEngine.ts

import { BuilderComponent, Breakpoint } from "@lib/exporter/schema"
import { applyConstraints } from "@lib/layout/constraints"

export function applyResize(
  component: BuilderComponent,
  dw: number,
  dh: number,
  parentWidth: number,
  parentHeight: number,
  breakpoint: Breakpoint
): BuilderComponent {
  const props = component.propsPerBreakpoint[breakpoint] || {}

  const updated = {
    ...component,
    propsPerBreakpoint: {
      ...component.propsPerBreakpoint,
      [breakpoint]: {
        ...props,
        width: Math.max(20, (props.width || 0) + dw),
        height: Math.max(20, (props.height || 0) + dh),
      },
    },
  }

  return applyConstraints(updated, parentWidth, parentHeight, breakpoint)
}

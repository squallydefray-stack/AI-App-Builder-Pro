// lib/exporter/constraints.ts
//
//  constraints.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/24/26.
//

import { BuilderComponent, Breakpoint, StyleProps } from "@lib/exporter/schema"

/**
 * Safely applies horizontal and vertical constraints to a component for a given breakpoint.
 * Automatically fills in missing x, y, width, height with defaults.
 */
export function applyConstraints(
  component: BuilderComponent,
  parentWidth: number,
  parentHeight: number,
  breakpoint: Breakpoint
): BuilderComponent {
  // Ensure propsPerBreakpoint exists
  const existingProps: StyleProps = component.propsPerBreakpoint[breakpoint] ?? {}

  // Fill defaults if missing
  const safeProps: StyleProps = {
    x: existingProps.x ?? 0,
    y: existingProps.y ?? 0,
    width: existingProps.width ?? 100,
    height: existingProps.height ?? 50,
    ...existingProps, // preserve other style props like color, borderRadius
  }

  // If no constraints, just return the component with safe props
  if (!component.layout?.constraints) {
    return {
      ...component,
      propsPerBreakpoint: {
        ...component.propsPerBreakpoint,
        [breakpoint]: safeProps,
      },
    }
  }

  const { horizontal, vertical } = component.layout.constraints

  // Apply horizontal constraints
  if (horizontal === "right") {
    safeProps.x = parentWidth - safeProps.width - (safeProps.x ?? 0)
  } else if (horizontal === "center-x") {
    safeProps.x = (parentWidth - safeProps.width) / 2
  }

  // Apply vertical constraints
  if (vertical === "bottom") {
    safeProps.y = parentHeight - safeProps.height - (safeProps.y ?? 0)
  } else if (vertical === "center-y") {
    safeProps.y = (parentHeight - safeProps.height) / 2
  }

  return {
    ...component,
    propsPerBreakpoint: {
      ...component.propsPerBreakpoint,
      [breakpoint]: safeProps,
    },
  }
}

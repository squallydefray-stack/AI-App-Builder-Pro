// lib/layout/constraints.ts
// AI-App-Builder-Pro

import { BuilderComponent, Breakpoint, StyleProps } from "@lib/exporter/schema"

/**
 * Apply layout constraints to a component for a given breakpoint
 */
export function applyConstraints(
  component: BuilderComponent,
  parentWidth: number,
  parentHeight: number,
  breakpoint: Breakpoint
): BuilderComponent {
  // Ensure propsPerBreakpoint[breakpoint] exists
  const bpProps: StyleProps = component.propsPerBreakpoint[breakpoint] || {}

  const defaultProps: StyleProps = {
    width: bpProps.width ?? 100,
    height: bpProps.height ?? 50,
    x: bpProps.x ?? 0,
    y: bpProps.y ?? 0,
  }

  // If no constraints, return component with defaults applied
  if (!component.layout.constraints) {
    return {
      ...component,
      propsPerBreakpoint: {
        ...component.propsPerBreakpoint,
        [breakpoint]: defaultProps,
      },
    }
  }

  const { horizontal, vertical } = component.layout.constraints
  const updated: StyleProps = { ...defaultProps }

  // Horizontal alignment
  if (horizontal === "right") updated.x = parentWidth - (bpProps.width ?? 0) - (bpProps.x ?? 0)
  if (horizontal === "center-x") updated.x = (parentWidth - (bpProps.width ?? 0)) / 2

  // Vertical alignment
  if (vertical === "bottom") updated.y = parentHeight - (bpProps.height ?? 0) - (bpProps.y ?? 0)
  if (vertical === "center-y") updated.y = (parentHeight - (bpProps.height ?? 0)) / 2

  return {
    ...component,
    propsPerBreakpoint: {
      ...component.propsPerBreakpoint,
      [breakpoint]: updated,
    },
  }
}

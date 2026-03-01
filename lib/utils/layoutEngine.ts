// lib/utils/layoutEngine.ts
import { BuilderComponent, Breakpoint } from "@lib/exporter/schema"

export interface LayoutOptions {
  orientation?: "portrait" | "landscape"
  animate?: boolean
}

/**
 * Recursively applies layout rules to a component and its children
 */
export function applyLayoutTree(
  component: BuilderComponent,
  breakpoint: Breakpoint,
  options?: LayoutOptions
): BuilderComponent {
  // Clone to avoid mutation
  const laidOut = { ...component }

  // Example: apply layout properties per breakpoint
  const props = laidOut.propsPerBreakpoint?.[breakpoint] || {}
  laidOut.props = { ...laidOut.props, ...props }

  // Here you can handle `options.animate` if needed
  if (options?.animate) {
    // Example: mark component as needing animation
    laidOut.props = { ...laidOut.props, animate: true }
  }

  // Recursively apply layout to children
  if (laidOut.children && laidOut.children.length > 0) {
    laidOut.children = laidOut.children.map((child) =>
      applyLayoutTree(child, breakpoint, options)
    )
  }

  return laidOut
}

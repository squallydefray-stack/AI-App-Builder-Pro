// lib/layout/layoutTree.ts
import { BuilderComponent, Breakpoint } from "@lib/exporter/schema"
import { applyAutoLayout } from "./autoLayout"
import { applyConstraints } from "./constraints"

/**
 * Recursively applies layout rules to a component and its children
 * @param component BuilderComponent to layout
 * @param breakpoint Current breakpoint
 * @param parentWidth Width of parent container
 * @param parentHeight Height of parent container
 * @returns BuilderComponent with updated layout positions
 */
export function applyLayoutTree(
  component: BuilderComponent,
  breakpoint: Breakpoint,
  parentWidth: number = 1200,
  parentHeight: number = 800
): BuilderComponent {
  let updated = component

  // Apply auto layout if enabled
  updated = applyAutoLayout(updated, breakpoint)

  // Apply constraints (width/height limits, bounds)
  updated = applyConstraints(updated, parentWidth, parentHeight, breakpoint)

  // Recursively apply layout to children
  if (updated.children) {
    updated = {
      ...updated,
      children: updated.children.map((child) =>
        applyLayoutTree(child, breakpoint, parentWidth, parentHeight)
      ),
    }
  }

  return updated
}
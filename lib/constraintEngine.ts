// lib/constraintEngine.ts
import { BuilderComponent } from "@lib/exporter/schema"

interface ParentLayout {
  width?: number
  height?: number
}

/**
 * Apply parent-aware constraints recursively
 */
export function applyParentConstraints(
  comp: BuilderComponent,
  parentWidth?: number,
  parentHeight?: number
): BuilderComponent {
  let { width, height, widthMode, heightMode } = comp.layout || {}

  // Parent-aware sizing
  if (widthMode === "fill" && parentWidth !== undefined) width = parentWidth
  if (heightMode === "fill" && parentHeight !== undefined) height = parentHeight
  if (widthMode === "hug") width = undefined // dynamic
  if (heightMode === "hug") height = undefined

  // If AutoLayout parent, distribute space to children
  if (comp.children?.length) {
    const auto = comp.layout?.autoLayout
    const parentW = width ?? parentWidth
    const parentH = height ?? parentHeight

    comp.children = comp.children.map((child) => {
      const childLayout = child.layout || {}
      let childWidth = childLayout.width
      let childHeight = childLayout.height

      // Fill logic
      if (childLayout.widthMode === "fill" && parentW !== undefined) childWidth = parentW
      if (childLayout.heightMode === "fill" && parentH !== undefined) childHeight = parentH

      // Hug logic: keep intrinsic size
      if (childLayout.widthMode === "hug") childWidth = childWidth ?? undefined
      if (childLayout.heightMode === "hug") childHeight = childHeight ?? undefined

      const updatedChild = {
        ...child,
        layout: { ...childLayout, width: childWidth, height: childHeight },
      }

      // Recursively apply propagation
      return applyParentConstraints(updatedChild, childWidth, childHeight)
    })
  }

  return { ...comp, layout: { ...comp.layout, width, height } }
}

/**
 * Resize a component with children respecting constraints
 */
export function applyResizeConstraints(
  comp: BuilderComponent,
  dx: number,
  dy: number,
  corner: "tl" | "tr" | "bl" | "br",
  parentLayout?: ParentLayout
): BuilderComponent {
  let { width = 0, height = 0, x = 0, y = 0 } = comp.layout || {}

  // Corner-based resize
  switch (corner) {
    case "br": width += dx; height += dy; break
    case "tr": width += dx; height -= dy; y += dy; break
    case "bl": width -= dx; height += dy; x += dx; break
    case "tl": width -= dx; height -= dy; x += dx; y += dy; break
  }

  // Enforce min/max
  width = Math.max(20, width)
  height = Math.max(20, height)
  if (parentLayout) {
    width = Math.min(width, parentLayout.width ?? width)
    height = Math.min(height, parentLayout.height ?? height)
  }

  let updated = { ...comp, layout: { ...comp.layout, width, height, x, y } }

  // Propagate to children with fill
  if (updated.children?.length) {
    updated.children = updated.children.map((child) => {
      const childLayout = child.layout || {}
      let newChildWidth = childLayout.width
      let newChildHeight = childLayout.height

      if (childLayout.widthMode === "fill") newChildWidth = width
      if (childLayout.heightMode === "fill") newChildHeight = height

      const propagatedChild = {
        ...child,
        layout: { ...childLayout, width: newChildWidth, height: newChildHeight },
      }

      return applyParentConstraints(propagatedChild, newChildWidth, newChildHeight)
    })
  }

  return updated
}

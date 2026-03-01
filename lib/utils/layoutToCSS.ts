// lib/utils/layoutToCSS.ts
// AI App Builder Pro — Ultra Platinum Layout → CSS Translator

import { BuilderComponent, Breakpoint } from "@lib/exporter/schema"

/* ============================================================
   TYPES
============================================================ */

export interface LayoutToCSSOptions {
  parentWidth?: number
  parentHeight?: number
  includeTransitions?: boolean
}

/* ============================================================
   MAIN FUNCTION
============================================================ */

export function layoutToCSS(
  component: BuilderComponent,
  breakpoint: Breakpoint,
  options: LayoutToCSSOptions = {}
): React.CSSProperties {
  const {
    parentWidth,
    parentHeight,
    includeTransitions = true,
  } = options

  // Get breakpoint-specific props
  const props =
    component.propsPerBreakpoint?.[breakpoint] ||
    component.propsPerBreakpoint?.base ||
    {}

  const layout = component.layout || {}
  const mode = layout.mode || "absolute"

  const style: React.CSSProperties = {
    boxSizing: "border-box",
  }

  /* ============================================================
     POSITIONING MODE
  ============================================================ */

  if (mode === "absolute") {
    style.position = "absolute"

    style.left = props.x ?? 0
    style.top = props.y ?? 0
    style.width = props.width ?? "auto"
    style.height = props.height ?? "auto"
  }

  if (mode === "auto") {
    style.position = "relative"
    style.display = "flex"

    const auto = layout.autoLayout || {}

    style.flexDirection = auto.direction || "row"
    style.gap = auto.gap ?? 0
    style.padding = auto.padding ?? 0
    style.alignItems = auto.align || "flex-start"
    style.justifyContent = auto.justify || "flex-start"

    if (props.width) style.width = props.width
    if (props.height) style.height = props.height
  }

  /* ============================================================
     CONSTRAINTS (Stretch / Center)
  ============================================================ */

  const constraints = layout.constraints || []

  if (parentWidth !== undefined && parentHeight !== undefined) {
    const x = Number(props.x ?? 0)
    const y = Number(props.y ?? 0)
    const width = Number(props.width ?? 0)
    const height = Number(props.height ?? 0)

    const hasLeft = constraints.includes("left")
    const hasRight = constraints.includes("right")
    const hasTop = constraints.includes("top")
    const hasBottom = constraints.includes("bottom")

    // Horizontal Stretch
    if (hasLeft && hasRight) {
      style.left = x
      style.width = parentWidth - x - (parentWidth - (x + width))
    } else if (hasRight && !hasLeft) {
      style.left = parentWidth - width - (parentWidth - (x + width))
    }

    // Vertical Stretch
    if (hasTop && hasBottom) {
      style.top = y
      style.height = parentHeight - y - (parentHeight - (y + height))
    } else if (hasBottom && !hasTop) {
      style.top = parentHeight - height - (parentHeight - (y + height))
    }

    // Centering
    if (constraints.includes("center-x")) {
      style.left = parentWidth / 2 - width / 2
    }

    if (constraints.includes("center-y")) {
      style.top = parentHeight / 2 - height / 2
    }
  }

  /* ============================================================
     VISUAL STYLES
  ============================================================ */

  if (props.backgroundColor)
    style.backgroundColor = props.backgroundColor

  if (props.color)
    style.color = props.color

  if (props.borderRadius !== undefined)
    style.borderRadius = props.borderRadius

  if (props.fontSize !== undefined)
    style.fontSize = props.fontSize

  if (props.opacity !== undefined)
    style.opacity = props.opacity

  if (props.boxShadow)
    style.boxShadow = props.boxShadow

  if (props.border)
    style.border = props.border

  /* ============================================================
     TRANSITIONS (Ultra Smooth Breakpoint Switching)
  ============================================================ */

  if (includeTransitions) {
    style.transition = "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
  }

  return style
}

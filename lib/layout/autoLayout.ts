// lib/layout/autoLayout.ts
import { BuilderComponent, Breakpoint } from "@lib/exporter/schema"

/**
 * Apply auto-layout to a single component
 * @param component BuilderComponent
 * @param breakpoint Current breakpoint
 * @returns BuilderComponent with layout positions updated
 */
export function applyAutoLayout(
  component: BuilderComponent,
  breakpoint: Breakpoint
): BuilderComponent {
  const layout = component.layout

  if (!layout || layout.mode !== "auto" || !layout.autoLayout?.enabled) {
    return component
  }

  const auto = layout.autoLayout
  const orientation = auto.orientation ?? "vertical" // default vertical

  let offsetX = 0
  let offsetY = 0

  const updatedChildren = component.children?.map((child, index) => {
    const childStyle = child.propsPerBreakpoint?.[breakpoint] ?? child.style ?? {}

    const childWidth =
      childStyle.width === "fill"
        ? childStyle.width
        : childStyle.width ?? 100
    const childHeight =
      childStyle.height === "fill"
        ? childStyle.height
        : childStyle.height ?? 50

    const childPosition = {
      x: orientation === "row" ? offsetX : 0,
      y: orientation === "column" ? offsetY : 0,
    }

    // Update offsets for next child
    if (orientation === "row") {
      offsetX += (childWidth as number) + (auto.gap ?? 0)
    } else {
      offsetY += (childHeight as number) + (auto.gap ?? 0)
    }

    return {
      ...child,
      position: childPosition,
    }
  })

  return {
    ...component,
    children: updatedChildren,
  }
}
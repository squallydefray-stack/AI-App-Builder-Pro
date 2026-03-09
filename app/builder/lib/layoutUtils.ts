// app/builder/lib/layoutUtils.ts
import { BuilderComponent, Breakpoint } from "@lib/exporter/schema"

export interface SnapGuide {
  axis: "x" | "y"
  value: number
}

/* =========================================
   APPLY AUTO LAYOUT
========================================= */
export function applyLayoutTree(
  component: BuilderComponent,
  breakpoint: Breakpoint
): BuilderComponent {
  const props =
    component.propsPerBreakpoint?.[breakpoint] ||
    component.propsPerBreakpoint?.base ||
    {}

  const updated: BuilderComponent = { ...component }

  if (updated.layout?.mode === "auto" && updated.children) {
    let offset = 0
    const direction = updated.layout.autoLayout?.direction || "column"
    const gap = updated.layout.autoLayout?.gap || 0

    updated.children = updated.children.map((child) => {
      const childProps =
        child.propsPerBreakpoint?.[breakpoint] ||
        child.propsPerBreakpoint?.base ||
        {}

      const childCopy = { ...child }

      if (direction === "row") {
        childCopy.propsPerBreakpoint = {
          ...child.propsPerBreakpoint,
          [breakpoint]: {
            ...childProps,
            x: offset,
            y: 0,
          },
        }
        offset += (childProps.width as number || 0) + gap
      } else {
        childCopy.propsPerBreakpoint = {
          ...child.propsPerBreakpoint,
          [breakpoint]: {
            ...childProps,
            x: 0,
            y: offset,
          },
        }
        offset += (childProps.height as number || 0) + gap
      }

      return applyLayoutTree(childCopy, breakpoint)
    })
  }

  return updated
}

/* =========================================
   SNAP TO GRID + COMPONENT EDGES
========================================= */
export function applySnapToComponents(
  component: BuilderComponent,
  allComponents: BuilderComponent[],
  breakpoint: Breakpoint,
  gridSize: number = 8,
  gridEnabled: boolean = true
): BuilderComponent {
  const props =
    component.propsPerBreakpoint?.[breakpoint] ||
    component.propsPerBreakpoint?.base ||
    {}

  const snapped: BuilderComponent = { ...component }

  let x = props.x ?? 0
  let y = props.y ?? 0

  if (gridEnabled) {
    x = Math.round(x / gridSize) * gridSize
    y = Math.round(y / gridSize) * gridSize
  }

  allComponents.forEach((other) => {
    if (other.id === component.id) return

    const otherProps =
      other.propsPerBreakpoint?.[breakpoint] ||
      other.propsPerBreakpoint?.base ||
      {}

    if (Math.abs(x - (otherProps.x ?? 0)) < gridSize) {
      x = otherProps.x ?? x
    }

    if (Math.abs(y - (otherProps.y ?? 0)) < gridSize) {
      y = otherProps.y ?? y
    }
  })

  snapped.propsPerBreakpoint = {
    ...component.propsPerBreakpoint,
    [breakpoint]: {
      ...props,
      x,
      y,
    },
  }

  return snapped
}

/* =========================================
   GENERATE ALIGNMENT GUIDES
========================================= */
export function generateSnapGuides(
  component: BuilderComponent,
  allComponents: BuilderComponent[],
  breakpoint: Breakpoint
): SnapGuide[] {
  const guides: SnapGuide[] = []

  const props =
    component.propsPerBreakpoint?.[breakpoint] ||
    component.propsPerBreakpoint?.base ||
    {}

  const x = props.x ?? 0
  const y = props.y ?? 0

  allComponents.forEach((other) => {
    if (other.id === component.id) return

    const otherProps =
      other.propsPerBreakpoint?.[breakpoint] ||
      other.propsPerBreakpoint?.base ||
      {}

    if (Math.abs(x - (otherProps.x ?? 0)) < 8) {
      guides.push({ axis: "x", value: otherProps.x ?? 0 })
    }

    if (Math.abs(y - (otherProps.y ?? 0)) < 8) {
      guides.push({ axis: "y", value: otherProps.y ?? 0 })
    }
  })

  return guides
}
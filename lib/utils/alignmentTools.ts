// lib/utils/alignmentTools.ts
// lib/utils/alignmentTools.ts
import { BuilderComponent } from "@lib/exporter/schema"

/**
 * Get the x/y position of a component (default to 0)
 */
export function getPosition(c: BuilderComponent) {
  return {
    x: c.props.base?.x ?? 0,
    y: c.props.base?.y ?? 0,
  }
}

/**
 * Align selected components to the leftmost component
 */
export function alignLeft(components: BuilderComponent[]): BuilderComponent[] {
  if (components.length === 0) return components
  const minX = Math.min(...components.map(c => getPosition(c).x))
  return components.map(c => ({
    ...c,
    props: {
      ...c.props,
      base: {
        ...c.props.base,
        x: minX,
      },
    },
  }))
}

/**
 * Align selected components to the rightmost component
 */
export function alignRight(components: BuilderComponent[]): BuilderComponent[] {
  if (components.length === 0) return components
  const maxRight = Math.max(
    ...components.map(c => (getPosition(c).x + (c.props.base?.width ?? 0)))
  )
  return components.map(c => ({
    ...c,
    props: {
      ...c.props,
      base: {
        ...c.props.base,
        x: maxRight - (c.props.base?.width ?? 0),
      },
    },
  }))
}

/**
 * Align selected components to the topmost component
 */
export function alignTop(components: BuilderComponent[]): BuilderComponent[] {
  if (components.length === 0) return components
  const minY = Math.min(...components.map(c => getPosition(c).y))
  return components.map(c => ({
    ...c,
    props: {
      ...c.props,
      base: {
        ...c.props.base,
        y: minY,
      },
    },
  }))
}

/**
 * Align selected components to the bottommost component
 */
export function alignBottom(components: BuilderComponent[]): BuilderComponent[] {
  if (components.length === 0) return components
  const maxBottom = Math.max(
    ...components.map(c => (getPosition(c).y + (c.props.base?.height ?? 0)))
  )
  return components.map(c => ({
    ...c,
    props: {
      ...c.props,
      base: {
        ...c.props.base,
        y: maxBottom - (c.props.base?.height ?? 0),
      },
    },
  }))
}

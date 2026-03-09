// lib/layout/constraintSolver.ts

import { BuilderComponent, Breakpoint } from "@lib/exporter/schema"

export type LayoutResult = {
  x: number
  y: number
  width: number
  height: number
}

export type ParentBounds = {
  width: number
  height: number
}

const DEFAULT_WIDTH = 100
const DEFAULT_HEIGHT = 50

export function solveConstraints(
  component: BuilderComponent,
  parent: ParentBounds,
  breakpoint: Breakpoint
): LayoutResult {
  const baseProps = component.props?.base ?? {}
  const bpProps = component.props?.[breakpoint] ?? {}

  // Breakpoint override resolution
  const resolved = {
    ...baseProps,
    ...bpProps,
  }

  let width = resolved.width ?? DEFAULT_WIDTH
  let height = resolved.height ?? DEFAULT_HEIGHT
  let x = resolved.x ?? 0
  let y = resolved.y ?? 0

  const c = component.constraints ?? {}

  // ================================
  // HORIZONTAL CONSTRAINTS
  // ================================

  const hasLeft = c.left !== undefined
  const hasRight = c.right !== undefined

  if (hasLeft && hasRight) {
    const left = Number(c.left) || 0
    const right = Number(c.right) || 0

    x = left
    width = parent.width - left - right
  } else if (hasLeft) {
    x = Number(c.left) || 0
  } else if (hasRight) {
    const right = Number(c.right) || 0
    x = parent.width - width - right
  }

  if (c.centerX) {
    x = (parent.width - width) / 2
  }

  // ================================
  // VERTICAL CONSTRAINTS
  // ================================

  const hasTop = c.top !== undefined
  const hasBottom = c.bottom !== undefined

  if (hasTop && hasBottom) {
    const top = Number(c.top) || 0
    const bottom = Number(c.bottom) || 0

    y = top
    height = parent.height - top - bottom
  } else if (hasTop) {
    y = Number(c.top) || 0
  } else if (hasBottom) {
    const bottom = Number(c.bottom) || 0
    y = parent.height - height - bottom
  }

  if (c.centerY) {
    y = (parent.height - height) / 2
  }

  width = Math.max(0, width)
  height = Math.max(0, height)

  return { x, y, width, height }
}

// lib/layout/constraintSolver.ts

import { BuilderComponent } from "@lib/exporter/schema"

export function applyConstraints(
  component: BuilderComponent,
  parentWidth: number,
  parentHeight: number
): BuilderComponent {

  if (!component.constraints) return component

  const base = component.props.base || {}
  let width = base.width || 100
  let height = base.height || 50
  let x = base.x || 0
  let y = base.y || 0

  const c = component.constraints

  // Horizontal stretch
  if (c.left && c.right) {
    width = parentWidth
    x = 0
  }

  // Vertical stretch
  if (c.top && c.bottom) {
    height = parentHeight
    y = 0
  }

  // Centering
  if (c.centerX) {
    x = parentWidth / 2 - width / 2
  }

  if (c.centerY) {
    y = parentHeight / 2 - height / 2
  }

  return {
    ...component,
    props: {
      ...component.props,
      base: {
        ...base,
        width,
        height,
        x,
        y,
      },
    },
  }
}

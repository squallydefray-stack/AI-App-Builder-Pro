//
//  constraintEngine.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/17/26.
//


// lib/layout/constraintEngine.ts

import { BuilderComponent } from "@lib/exporter/schema"

export function applyConstraints(
  component: BuilderComponent,
  parentWidth: number,
  parentHeight: number
) {
  if (!component.layout?.constraints) return component

  const base = component.props.base || {}
  const constraints = component.layout.constraints

  let width = base.width || 100
  let height = base.height || 50

  if (constraints.includes("stretch-x")) {
    width = parentWidth
  }

  if (constraints.includes("stretch-y")) {
    height = parentHeight
  }

  if (constraints.includes("center-x")) {
    base.left = parentWidth / 2 - width / 2
  }

  if (constraints.includes("center-y")) {
    base.top = parentHeight / 2 - height / 2
  }

  return {
    ...component,
    props: {
      ...component.props,
      base: {
        ...base,
        width,
        height,
      },
    },
  }
}

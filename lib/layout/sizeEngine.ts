//
//  sizeEngine.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/17/26.
//


// lib/layout/sizeEngine.ts

import { BuilderComponent } from "@lib/exporter/schema"

export function applySizeModes(
  component: BuilderComponent,
  parentWidth: number,
  parentHeight: number
): BuilderComponent {
  const widthMode = component.layout?.widthMode || "fixed"
  const heightMode = component.layout?.heightMode || "fixed"

  const base = component.props.base || {}

  let width = base.width || 100
  let height = base.height || 50

  // WIDTH
  if (widthMode === "fill") {
    width = parentWidth
  }

  if (widthMode === "hug") {
    if (component.children?.length) {
      width = component.children.reduce(
        (max, child) => Math.max(max, child.props.base?.width || 0),
        0
      )
    }
  }

  // HEIGHT
  if (heightMode === "fill") {
    height = parentHeight
  }

  if (heightMode === "hug") {
    if (component.children?.length) {
      height = component.children.reduce(
        (total, child) => total + (child.props.base?.height || 0),
        0
      )
    }
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

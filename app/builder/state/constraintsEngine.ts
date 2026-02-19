//
//  constraintsEngine.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/17/26.
//


"use client"

import { BuilderComponent, Breakpoint } from "@lib/exporter/schema"

/**
 * Apply constraints and AutoLayout logic to a component tree.
 * Updates position, size, and alignment for children.
 */
export function applyConstraints(
  nodes: BuilderComponent[],
  parentWidth?: number,
  parentHeight?: number
): BuilderComponent[] {
  return nodes.map((node) => {
    const baseProps = node.props.base || {}

    // Handle fill/hug width/height
    let width = baseProps.width
    let height = baseProps.height

    if (node.layout?.hug?.width) {
      width = node.children?.reduce((max, c) => {
        return Math.max(max, (c.props.base?.width || 0))
      }, 0) || width
    }

    if (node.layout?.hug?.height) {
      height = node.children?.reduce((max, c) => {
        return Math.max(max, (c.props.base?.height || 0))
      }, 0) || height
    }

    if (node.layout?.fill?.width && parentWidth) width = parentWidth - (baseProps.x || 0)
    if (node.layout?.fill?.height && parentHeight) height = parentHeight - (baseProps.y || 0)

    // Apply AutoLayout to children recursively
    let children: BuilderComponent[] | undefined
    if (node.children) {
      children = applyConstraints(node.children, width, height)
    }

    return {
      ...node,
      props: {
        ...node.props,
        base: { ...baseProps, width, height },
      },
      children,
    }
  })
}

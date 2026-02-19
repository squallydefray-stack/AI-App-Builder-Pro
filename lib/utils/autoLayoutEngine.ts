//
//  autoLayoutEngine.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/17/26.
//


// app/builder/utils/autoLayoutEngine.ts
import { BuilderComponent } from "@lib/exporter/schema"
import { applyConstraints } from "@lib/exporter/constraints"

interface Layout {
  x: number
  y: number
  width: number
  height: number
}

export class AutoLayoutEngine {
  static DEFAULT_SPACING = 10

  /**
   * Compute layout recursively for a component
   */
  static computeLayout(node: BuilderComponent, parentX = 0, parentY = 0): Layout {
    // Base props
    const base = node.props.base || {}
    let x = base.x ?? parentX
    let y = base.y ?? parentY
    let width = base.width ?? 100
    let height = base.height ?? 50

    // Apply constraints (min/max)
    const constrained = applyConstraints(node, { x, y, width, height })
    x = constrained.x
    y = constrained.y
    width = constrained.width
    height = constrained.height

    // Handle children auto-layout
    if (node.children && node.children.length > 0) {
      let offsetY = y + AutoLayoutEngine.DEFAULT_SPACING
      node.children.forEach((child) => {
        const childLayout = AutoLayoutEngine.computeLayout(child, x + AutoLayoutEngine.DEFAULT_SPACING, offsetY)
        offsetY += childLayout.height + AutoLayoutEngine.DEFAULT_SPACING
      })

      // Optionally, update container height
      height = Math.max(height, offsetY - y)
    }

    return { x, y, width, height }
  }

  /**
   * Compute layout for an array of components (e.g., top-level page components)
   */
  static computePageLayout(components: BuilderComponent[]): BuilderComponent[] {
    let offsetY = 0
    return components.map((c) => {
      const layout = AutoLayoutEngine.computeLayout(c, 0, offsetY)
      offsetY += layout.height + AutoLayoutEngine.DEFAULT_SPACING
      return { ...c }
    })
  }
}

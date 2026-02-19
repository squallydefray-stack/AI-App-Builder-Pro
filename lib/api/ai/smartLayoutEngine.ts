//
//  smartLayoutEngine.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/16/26.
//


// lib/ai/smartLayoutEngine.ts
import { BuilderComponent, LayoutConfig, ResponsiveProps } from "../exporter/schema"

export function autoSnapLayout(components: BuilderComponent[], parentWidth = 1200): BuilderComponent[] {
  const spacing = 16
  let x = 0
  let y = 0
  let rowHeight = 0
  const maxWidth = parentWidth

  return components.map((c) => {
    const width = c.props.base?.width ? parseInt(c.props.base.width.toString()) : 200
    const height = c.props.base?.height ? parseInt(c.props.base.height.toString()) : 100

    if (x + width > maxWidth) {
      x = 0
      y += rowHeight + spacing
      rowHeight = 0
    }

    c.props.base = { ...c.props.base, x, y }
    rowHeight = Math.max(rowHeight, height)
    x += width + spacing

    // Recursively snap children
    if (c.children?.length) {
      c.children = autoSnapLayout(c.children, width)
    }

    return c
  })
}

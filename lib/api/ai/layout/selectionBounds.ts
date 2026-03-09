//
//  selectionBounds.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/16/26.
//


import { BuilderComponent } from "@/lib/exporter/schema"

export function computeSelectionBounds(
  selected: BuilderComponent[]
) {
  const xs = selected.map(c => c.props.base.x || 0)
  const ys = selected.map(c => c.props.base.y || 0)
  const widths = selected.map(c => c.props.base.width || 0)
  const heights = selected.map(c => c.props.base.height || 0)

  const minX = Math.min(...xs)
  const minY = Math.min(...ys)
  const maxX = Math.max(...xs.map((x, i) => x + widths[i]))
  const maxY = Math.max(...ys.map((y, i) => y + heights[i]))

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  }
}

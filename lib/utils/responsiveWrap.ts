//
//  responsiveWrap.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/16/26.
//


// utils/responsiveWrap.ts
import { BuilderComponent } from "@lib/exporter/schema"

export function autoWrapChildren(
  children: BuilderComponent[],
  breakpoint: "base" | "tablet" | "mobile",
  containerWidth: number
) {
  const spacing = 16
  let x = 0
  let y = 0
  let rowHeight = 0

  return children.map((c) => {
    const size = c.props[breakpoint] || c.props.base
    if (!size) return { ...c, position: { x, y } }

    if (x + (size.width as number) > containerWidth) {
      x = 0
      y += rowHeight + spacing
      rowHeight = 0
    }

    const pos = { x, y }
    x += (size.width as number) + spacing
    rowHeight = Math.max(rowHeight, size.height as number)

    return { ...c, position: pos }
  })
}

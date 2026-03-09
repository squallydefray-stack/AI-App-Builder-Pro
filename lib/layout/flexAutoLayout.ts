//
//  flexAutoLayout.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/23/26.
//


// lib/layout/flexAutoLayout.ts
// Ultra Platinum Flex Engine

import { BuilderComponent } from "@lib/exporter/schema"

export function applyFlexLayout(parent: BuilderComponent, parentWidth: number): BuilderComponent {
  const auto = parent.layout?.autoLayout
  if (!auto?.enabled || !parent.children?.length) return parent

  const direction = auto.direction ?? "row"
  const gap = auto.gap ?? 0
  const wrap = auto.wrap ?? false
  const align = auto.align ?? "start"

  let x = 0
  let y = 0
  let rowHeight = 0

  const updatedChildren = parent.children.map(child => {
    const box = {
      x,
      y,
      width: child.style?.width ?? 100,
      height: child.style?.height ?? 100,
    }

    if (wrap && direction === "row" && x + box.width > parentWidth) {
      x = 0
      y += rowHeight + gap
      rowHeight = 0
    }

    box.x = x
    box.y = y

    x += box.width + gap
    rowHeight = Math.max(rowHeight, box.height)

    return {
      ...child,
      style: {
        ...child.style,
        position: "absolute",
        left: box.x,
        top: box.y,
      },
    }
  })

  return { ...parent, children: updatedChildren }
}

//
//  gridEngine.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/17/26.
//


// lib/layout/gridEngine.ts

import { BuilderComponent } from "@lib/exporter/schema"

interface GridConfig {
  minColumnWidth?: number
  gap?: number
}

export function applyGridLayout(
  container: BuilderComponent,
  containerWidth: number,
  config: GridConfig = {}
): BuilderComponent {
  if (!container.children?.length) return container

  const minColumnWidth = config.minColumnWidth || 200
  const gap = config.gap || 16

  const columns = Math.max(1, Math.floor(containerWidth / minColumnWidth))

  const updatedChildren = container.children.map((child, index) => {
    const row = Math.floor(index / columns)
    const col = index % columns

    return {
      ...child,
      props: {
        ...child.props,
        base: {
          ...child.props.base,
          gridRow: row + 1,
          gridColumn: col + 1,
        },
      },
    }
  })

  return {
    ...container,
    layout: {
      ...container.layout,
      display: "grid",
      autoLayout: undefined,
    },
    props: {
      ...container.props,
      base: {
        ...container.props.base,
        gap,
      },
    },
    children: updatedChildren,
  }
}

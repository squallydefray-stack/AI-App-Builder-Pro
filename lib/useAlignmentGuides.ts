//
//  useAlignmentGuides.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/17/26.
//


// lib/useAlignmentGuides.ts
import { useMemo } from "react"
import { BuilderComponent } from "@lib/exporter/schema"

export interface GuideLine {
  x?: number
  y?: number
}

export function useAlignmentGuides(
  components: BuilderComponent[],
  movingIds: string[]
) {
  return useMemo(() => {
    const moving = components.filter((c) => movingIds.includes(c.id))
    const staticComps = components.filter((c) => !movingIds.includes(c.id))

    const lines: GuideLine[] = []

    moving.forEach((m) => {
      const mx = m.layout?.x || 0
      const my = m.layout?.y || 0
      const mw = m.layout?.width || 0
      const mh = m.layout?.height || 0
      const mCenterX = mx + mw / 2
      const mCenterY = my + mh / 2

      staticComps.forEach((s) => {
        const sx = s.layout?.x || 0
        const sy = s.layout?.y || 0
        const sw = s.layout?.width || 0
        const sh = s.layout?.height || 0
        const sCenterX = sx + sw / 2
        const sCenterY = sy + sh / 2

        const snapThreshold = 5

        // Vertical lines: left, center, right
        if (Math.abs(mx - sx) < snapThreshold || Math.abs(mx - (sx + sw)) < snapThreshold || Math.abs(mCenterX - sCenterX) < snapThreshold) {
          lines.push({ x: mx })
        }

        // Horizontal lines: top, center, bottom
        if (Math.abs(my - sy) < snapThreshold || Math.abs(my - (sy + sh)) < snapThreshold || Math.abs(mCenterY - sCenterY) < snapThreshold) {
          lines.push({ y: my })
        }
      })
    })

    return lines
  }, [components, movingIds])
}

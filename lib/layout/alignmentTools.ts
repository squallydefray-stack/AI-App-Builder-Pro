// lib/utils/alignmentTools.ts
// AI App Builder Pro
// Professional alignment + distribution engine

// lib/alignmentTools.ts
import { BuilderPage, BuilderComponent } from "@lib/exporter/schema"

export function applyAlignment(
  page: BuilderPage,
  selectedIds: string[],
  direction: "left" | "right" | "top" | "bottom" | "center"
): BuilderComponent[] {
  const comps = page.components.filter(c => selectedIds.includes(c.id))
  if (!comps.length) return page.components

  let minX = Math.min(...comps.map(c => c.layout?.x || 0))
  let minY = Math.min(...comps.map(c => c.layout?.y || 0))
  let maxX = Math.max(...comps.map(c => (c.layout?.x || 0) + (c.layout?.width || 0)))
  let maxY = Math.max(...comps.map(c => (c.layout?.y || 0) + (c.layout?.height || 0)))

  const updated = page.components.map(c => {
    if (!selectedIds.includes(c.id)) return c
    const layout = { ...c.layout }
    switch(direction){
      case "left": layout.x = minX; break
      case "right": layout.x = maxX - (layout.width||0); break
      case "top": layout.y = minY; break
      case "bottom": layout.y = maxY - (layout.height||0); break
      case "center": layout.x = minX + (maxX-minX)/2 - (layout.width||0)/2; layout.y = minY + (maxY-minY)/2 - (layout.height||0)/2; break
    }
    return { ...c, layout }
  })

  return updated
}

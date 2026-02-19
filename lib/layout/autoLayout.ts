//
//  autoLayout.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/18/26.
//


export function computeLayoutStyles(layout: any) {
  if (!layout) return {}

  if (layout.type === "flex") {
    return {
      display: "flex",
      flexDirection: layout.direction || "row",
      justifyContent: layout.justify || "flex-start",
      alignItems: layout.align || "stretch",
      gap: layout.gap || 0,
    }
  }

  if (layout.type === "grid") {
    return {
      display: "grid",
      gap: layout.gap || 0,
    }
  }

  return {}
}

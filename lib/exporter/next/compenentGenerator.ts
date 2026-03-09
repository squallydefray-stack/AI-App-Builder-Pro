// lib/exporter/next/componentGenerator.ts

import { BuilderComponent } from "@/lib/exporter/schema"

export function generateComponentJSX(
  node: BuilderComponent,
  indentLevel: number = 0
): string {
  const indent = "  ".repeat(indentLevel)

  const style = buildStyleObject(node)

  const children =
    node.children?.map((c) =>
      generateComponentJSX(c, indentLevel + 1)
    ).join("\n") || ""

  if (children) {
    return `${indent}<div style={${style}}>
${children}
${indent}</div>`
  }

  return `${indent}<div style={${style}} />`
}

/* ============================================================
   STYLE BUILDER
============================================================ */

function buildStyleObject(node: BuilderComponent): string {
  const base = node.props?.base || {}

  const layout = node.layout || {}

  const style: Record<string, any> = {
    ...base,
  }

  if (layout.display === "flex") {
    style.display = "flex"
    style.flexDirection = layout.direction || "row"
    if (layout.gap) style.gap = layout.gap
    if (layout.justify) style.justifyContent = layout.justify
    if (layout.align) style.alignItems = layout.align
  }

  if (layout.display === "grid") {
    style.display = "grid"
  }

  if (layout.display === "absolute") {
    style.position = "absolute"
  }

  return JSON.stringify(style, null, 2)
}

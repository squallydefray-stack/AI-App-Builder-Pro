import { BuilderComponent, Breakpoint } from "@lib/exporter/schema"

/* =========================================
   PUBLIC EXPORT
========================================= */

export function exportToReact(
  components: BuilderComponent[],
  breakpoint: Breakpoint = "base"
): string {
  const body = components.map(c => renderNode(c, breakpoint)).join("\n")

  return `
import React from "react"

export default function GeneratedPage() {
  return (
    <div style={{ position: "relative", width: "100%", minHeight: "100vh" }}>
      ${body}
    </div>
  )
}
`
}

/* =========================================
   NODE RENDERER
========================================= */

function renderNode(
  node: BuilderComponent,
  breakpoint: Breakpoint
): string {
  const props = node.propsPerBreakpoint[breakpoint] ||
                node.propsPerBreakpoint.base ||
                {}

  const style = buildStyle(node, props)

  const children =
    node.children?.map(child => renderNode(child, breakpoint)).join("\n") || ""

  return `
    <div style={${JSON.stringify(style)}}>
      ${children}
    </div>
  `
}

/* =========================================
   STYLE BUILDER
========================================= */

function buildStyle(
  node: BuilderComponent,
  props: any
): Record<string, any> {

  const style: Record<string, any> = {}

  /* ---------- Layout Mode ---------- */

  if (node.layout.mode === "absolute") {
    style.position = "absolute"
    style.left = props.x ?? 0
    style.top = props.y ?? 0
    style.width = props.width ?? "auto"
    style.height = props.height ?? "auto"
  }

  if (node.layout.mode === "auto") {
    style.display = "flex"
    style.flexDirection = node.layout.autoLayout?.direction || "column"
    style.gap = node.layout.autoLayout?.gap || 0
    style.padding = node.layout.autoLayout?.padding || 0
    style.alignItems = node.layout.autoLayout?.align || "stretch"
  }

  /* ---------- Constraints ---------- */

  if (node.layout.constraints?.centerX) {
    style.marginLeft = "auto"
    style.marginRight = "auto"
  }

  if (node.layout.constraints?.centerY) {
    style.marginTop = "auto"
    style.marginBottom = "auto"
  }

  /* ---------- Visual Props ---------- */

  if (props.backgroundColor) style.backgroundColor = props.backgroundColor
  if (props.color) style.color = props.color
  if (props.borderRadius) style.borderRadius = props.borderRadius
  if (props.fontSize) style.fontSize = props.fontSize

  return style
}

// app/builder/exporter/UltraPlatinumExporter.ts
"use client"

import { BuilderComponent, Breakpoint } from "@lib/exporter/schema"
import { applyLayoutTree } from "@lib/utils/layoutEngine"
import { applySnapToComponents } from "@lib/utils/snapEngine"
// app/builder/exporter/UltraPlatinumExporter.ts


/* =========================================
   PUBLIC EXPORT FUNCTION
========================================= */
export function exportUltraPlatinumReact(
  components: BuilderComponent[],
  breakpoints: Breakpoint[] = ["base", "tablet", "mobile"]
): string {

  // Build JSX recursively with responsive styles
  const jsx = components.map((c) => renderNodeResponsive(c, breakpoints)).join("\n")

  // Generate media queries for tablet/mobile
  const mediaCSS = breakpoints
    .filter(bp => bp !== "base")
    .map(bp => {
      return `@media ${getMediaQuery(bp)} { ${generateBreakpointCSS(components, bp)} }`
    })
    .join("\n")

  return `
import React from "react"

export default function GeneratedPage() {
  return (
    <>
      <style>
        { \`${mediaCSS}\` }
      </style>
      <div style={{ position: "relative", width: "100%", minHeight: "100vh" }}>
        ${jsx}
      </div>
    </>
  )
}
`
}

/* =========================================
   NODE RENDERER RECURSIVE
========================================= */
function renderNodeResponsive(
  node: BuilderComponent,
  breakpoints: Breakpoint[]
): string {
  const baseProps = node.propsPerBreakpoint.base || {}
  const style = JSON.stringify(baseProps)

  const children = node.children?.map(c => renderNodeResponsive(c, breakpoints)).join("\n") || ""

  return `
    <div id="${node.id}" style={${style}}>
      ${children}
    </div>
  `
}

/* =========================================
   GENERATE BREAKPOINT CSS
========================================= */
function generateBreakpointCSS(
  components: BuilderComponent[],
  bp: Breakpoint
): string {
  let css = ""
  for (const c of components) {
    const props = c.propsPerBreakpoint[bp] || {}
    const styleStr = Object.entries(props)
      .map(([k, v]) => `${camelToKebab(k)}: ${v};`)
      .join(" ")
    css += `#${c.id} { ${styleStr} } `
    if (c.children) css += generateBreakpointCSS(c.children, bp)
  }
  return css
}

/* =========================================
   HELPERS
========================================= */
function getMediaQuery(bp: Breakpoint): string {
  switch (bp) {
    case "tablet": return "(max-width: 1024px)"
    case "mobile": return "(max-width: 768px)"
    default: return ""
  }
}

function camelToKebab(str: string) {
  return str.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase())
}

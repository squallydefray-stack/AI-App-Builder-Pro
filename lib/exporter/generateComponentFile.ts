import { BuilderSchema } from "@lib/exporter/schema"
import { styleToTailwind } from "./styleToTailwind"
import { camelToKebab } from "./generateComponentJSX"

export function generateComponentFile(node: BuilderComponent, depth = 0): { path: string; content: string } {
  const indent = "  ".repeat(depth)
  const type = node.type || "div"

  const classes = styleToTailwind(node.props?.desktop?.style || {})

  // Render children JSX recursively
  const childrenJSX = node.children?.map((child) => generateComponentJSX(child, depth + 1)).join("\n") || ""

  const jsx = childrenJSX
    ? `<${type} className="${classes}">\n${childrenJSX}\n</${type}>`
    : `<${type} className="${classes}" />`

  const fileContent = `
import React from "react"

export default function ${node.type}${node.id.replace(/-/g, "")}() {
  return (
    ${jsx}
  )
}
  `.trim()

  return {
    path: `components/${node.type}${node.id}.tsx`,
    content: fileContent,
  }
}

// Reuse the previous recursive JSX generator
function generateComponentJSX(node: BuilderComponent, depth = 0): string {
  const indent = "  ".repeat(depth)
  const type = node.type || "div"
  const classes = styleToTailwind(node.props?.desktop?.style || {})

  const childrenJSX = node.children?.map((child) => generateComponentJSX(child, depth + 1)).join("\n") || ""

  if (!childrenJSX) return `${indent}<${type} className="${classes}" />`

  return `${indent}<${type} className="${classes}">\n${childrenJSX}\n${indent}</${type}>`
}

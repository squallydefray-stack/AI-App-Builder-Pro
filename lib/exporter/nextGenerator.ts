import { BuilderSchema, BuilderComponent } from "@lib/exporter/schema"

export function generateNextJS(schema: BuilderSchema) {
  const files: Record<string, string> = {}

  schema.pages.forEach((page) => {
    const pageCode = generatePage(page.components)
    files[`app/${page.name}/page.tsx`] = pageCode
  })

  return files
}

function generatePage(components: BuilderComponent[]) {
  return `
"use client"
import React from "react"

export default function Page() {
  return (
    <div>
      ${components.map(renderComponentWeb).join("\n")}
    </div>
  )
}
`
}

function renderComponentWeb(component: BuilderComponent): string {
  const children = component.children?.map(renderComponentWeb).join("\n") || ""

  switch (component.type) {
    case "Layout":
      return `
<div style={${JSON.stringify(component.props.base)}}>
  ${children}
</div>
`

    case "Text":
      return `<p>${component.props.base.text || "Text"}</p>`

    case "Button":
      return `<button>${component.props.base.label || "Button"}</button>`

    case "Input":
      return `<input placeholder="${component.props.base.placeholder || ""}" />`

    default:
      return `<!-- Unknown component -->`
  }
}

// lib/exporter/generateAppFiles.ts
import { BuilderPage, BuilderComponent } from "@lib/exporter/schema"

/**
 * Generates a list of files for export
 * Each file: { path: string, content: string }
 */
export function generateAppFiles(pages: BuilderPage[]) {
  const files: { path: string; content: string }[] = []

  pages.forEach((page) => {
    const fileName = page.route.replace(/\//g, "_") + ".tsx"
    const jsx = page.components.map((c) => generateComponentJSX(c)).join("\n")

    const content = `import React from "react"

export default function ${page.name.replace(/\s/g, "")}() {
  return (
    <div className="p-4">
      ${jsx}
    </div>
  )
}`

    files.push({ path: fileName, content })
  })

  return files
}

/**
 * Recursive JSX generation from BuilderComponent
 */
function generateComponentJSX(comp: BuilderComponent): string {
  const classes = mapAutoLayoutToTailwind(comp)

  switch (comp.type) {
    case "Text":
      return `<div className="${classes}">${comp.props.base?.text || "Text"}</div>`

    case "Button":
      return `<button className="${classes} px-3 py-1 bg-black text-white rounded">
        ${comp.props.base?.label || "Button"}
      </button>`

    case "Repeater":
      const itemVar = comp.props.base?.itemName || "item"
      const childrenJSX = comp.children?.map((c) => generateComponentJSX(c)).join("\n") || ""
      return `{[0,1,2].map((${itemVar}, idx) => (
        ${childrenJSX}
      ))}`

    default:
      const childJSX = comp.children?.map((c) => generateComponentJSX(c)).join("\n") || ""
      return `<div className="${classes}">
        ${childJSX}
      </div>`
  }
}

/**
 * Converts AutoLayout + width/height modes to Tailwind classes
 */
function mapAutoLayoutToTailwind(comp: BuilderComponent) {
  const props = comp.props.base || {}
  const classes: string[] = []

  if (comp.layout?.autoLayout?.enabled) {
    classes.push("flex")
    classes.push(comp.layout.autoLayout.direction === "row" ? "flex-row" : "flex-col")
    if (comp.layout.autoLayout.justify) classes.push(`justify-${comp.layout.autoLayout.justify}`)
    if (comp.layout.autoLayout.align) classes.push(`items-${comp.layout.autoLayout.align}`)
    if (comp.layout.autoLayout.gap) classes.push(`gap-[${comp.layout.autoLayout.gap}px]`)
  }

  // Width/Height modes
  if (props.widthMode === "fill") classes.push("w-full")
  if (props.heightMode === "fill") classes.push("h-full")
  if (props.widthMode === "hug") classes.push("w-auto")
  if (props.heightMode === "hug") classes.push("h-auto")

  return classes.join(" ")
}

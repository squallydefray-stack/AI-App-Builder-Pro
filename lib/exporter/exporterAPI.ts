// lib/exporter/exporterAPI.ts
"use server"

import path from "path"
import { promises as fs } from "fs"
import { BuilderPage, BuilderComponent } from "@lib/exporter/schema"
import { pushToGitHub } from "./exporterGit"

// -------------------------
// Utilities
// -------------------------

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

  if (props.widthMode === "fill") classes.push("w-full")
  if (props.heightMode === "fill") classes.push("h-full")
  if (props.widthMode === "hug") classes.push("w-auto")
  if (props.heightMode === "hug") classes.push("h-auto")

  return classes.join(" ")
}

function generateComponentJSX(comp: BuilderComponent): string {
  const classes = mapAutoLayoutToTailwind(comp)
  const childJSX = comp.children?.map((c) => generateComponentJSX(c)).join("\n") || ""

  switch (comp.type) {
    case "Text":
      return `<div className="${classes}">${comp.props.base?.text || "Text"}</div>`
    case "Button":
      return `<button className="${classes} px-3 py-1 bg-black text-white rounded">
        ${comp.props.base?.label || "Button"}
      </button>`
    case "Repeater":
      const itemVar = comp.props.base?.itemName || "item"
      return `{[0,1,2].map((${itemVar}, idx) => (${childJSX}))}`
    default:
      return `<div className="${classes}">${childJSX}</div>`
  }
}

// -------------------------
// Export Functions
// -------------------------

export async function exportToNextJS(pages: BuilderPage[]) {
  const outputDir = path.resolve(process.cwd(), "exports/nextjs")
  await fs.mkdir(outputDir, { recursive: true })

  for (const page of pages) {
    const jsx = page.components.map(generateComponentJSX).join("\n")
    const fileName = page.route.replace(/\//g, "_") + ".tsx"
    const content = `import React from "react"

export default function ${page.name.replace(/\s/g, "")}() {
  return <div className="p-4">${jsx}</div>
}`
    await fs.writeFile(path.join(outputDir, fileName), content, "utf-8")
  }

  return outputDir
}

// -------------------------
// Git push wrapper
// -------------------------

export async function exportAndPushToGit(pages: BuilderPage[]) {
  const outputDir = await exportToNextJS(pages)
  const result = await pushToGitHub(outputDir)
  return result
}

// -------------------------
// Prop Validation
// -------------------------

export function validateProps(comp: BuilderComponent) {
  const errors: string[] = []
  if (comp.type === "Text" && !comp.props.base?.text) errors.push(`Text component ${comp.id} missing text`)
  if (comp.type === "Button" && !comp.props.base?.label) errors.push(`Button component ${comp.id} missing label`)
  if (comp.type === "Repeater" && !comp.children?.length) errors.push(`Repeater ${comp.id} has no children`)
  return errors
}

//
//  codeExporter.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/17/26.
//


// lib/exporter/codeExporter.ts
import fs from "fs"
import path from "path"
import { BuilderSchema, BuilderPage, BuilderComponent } from "./schema"

interface ExportOptions {
  outputDir: string
  platform: "web" | "react-native"
}

// Recursive Node → JSX
function renderComponentJSX(component: BuilderComponent, platform: "web" | "react-native"): string {
  const { type, props = {}, children = [] } = component

  const responsive = props.base || {}
  const className = responsive.className || ""

  let openTag = ""
  let closeTag = ""
  let innerContent = ""

  switch (type) {
    case "Text":
      if (platform === "web") {
        openTag = `<div className="${className}">`
        innerContent = responsive.text || "Text"
        closeTag = `</div>`
      } else {
        openTag = `<Text style={${JSON.stringify(responsive)}}>`
        innerContent = responsive.text || "Text"
        closeTag = `</Text>`
      }
      break

    case "Button":
      if (platform === "web") {
        openTag = `<button className="${className}">`
        innerContent = responsive.label || "Button"
        closeTag = `</button>`
      } else {
        openTag = `<Pressable style={${JSON.stringify(responsive)}}><Text>${responsive.label || "Button"}</Text>`
        innerContent = ""
        closeTag = `</Pressable>`
      }
      break

    default:
      openTag = `<div className="${className}">`
      closeTag = `</div>`
  }

  const childrenJSX = children.map((c) => renderComponentJSX(c, platform)).join("\n")

  return `${openTag}${innerContent}\n${childrenJSX}${closeTag}`
}

// Generate Page
function renderPageJSX(page: BuilderPage, platform: "web" | "react-native") {
  const pageContent = page.components.map((c) => renderComponentJSX(c, platform)).join("\n")
  if (platform === "web") {
    return `
      import React from "react"

      export default function ${page.name.replace(/\s+/g, "")}() {
        return (
          <div className="w-full h-full">
            ${pageContent}
          </div>
        )
      }
    `
  } else {
    return `
      import React from "react"
      import { View, Text, Pressable } from "react-native"

      export default function ${page.name.replace(/\s+/g, "")}() {
        return (
          <View style={{ flex: 1 }}>
            ${pageContent}
          </View>
        )
      }
    `
  }
}

// Main export function
export function exportBuilderSchema(schema: BuilderSchema, options: ExportOptions) {
  const { outputDir, platform } = options

  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true })

  // Create pages folder
  const pagesDir = path.join(outputDir, "pages")
  if (!fs.existsSync(pagesDir)) fs.mkdirSync(pagesDir)

  schema.pages.forEach((page) => {
    const pageJSX = renderPageJSX(page, platform)
    const filePath = path.join(pagesDir, `${page.name.replace(/\s+/g, "")}.tsx`)
    fs.writeFileSync(filePath, pageJSX, "utf-8")
  })

  console.log(`✅ Exported ${schema.pages.length} pages for ${platform} at ${outputDir}`)
}

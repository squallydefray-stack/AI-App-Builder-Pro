//
//  ExportPage.tsx
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/17/26.
//


"use client"

import React, { useState } from "react"
import { useBuilderStore } from "@/state/builderStore"
import { BuilderSchema, BuilderComponent } from "@lib/exporter/schema"
import fs from "fs"
import path from "path"
import simpleGit, { SimpleGit } from "simple-git"
import { nanoid } from "nanoid"

// ===============================
// Utilities
// ===============================

// Map AutoLayout + fill/hug → Tailwind or RN flex styles
function mapAutoLayoutToStyles(component: BuilderComponent, platform: "web" | "react-native") {
  const layout = component.layout || {}
  const auto = layout.autoLayout
  const style: Record<string, any> = {}

  if (auto?.enabled) {
    const dir = auto.direction === "row" ? "flex-row" : "flex-col"
    if (platform === "web") {
      style.className = `flex ${dir} ${auto.justify ? `justify-${auto.justify}` : ""} ${auto.align ? `items-${auto.align}` : ""} ${auto.gap ? `gap-[${auto.gap}px]` : ""}`
    } else {
      style.style = {
        flexDirection: auto.direction,
        justifyContent: auto.justify,
        alignItems: auto.align,
        gap: auto.gap || 0,
      }
    }
  }

  // Fill/Hug handling
  if (layout.widthMode === "fill") style.className = (style.className || "") + " w-full"
  if (layout.heightMode === "fill") style.className = (style.className || "") + " h-full"
  if (layout.widthMode === "hug") style.className = (style.className || "") + " w-auto"
  if (layout.heightMode === "hug") style.className = (style.className || "") + " h-auto"

  return style
}

// Recursive JSX generation with mapping
function renderComponentJSX(component: BuilderComponent, platform: "web" | "react-native") {
  const mappedStyles = mapAutoLayoutToStyles(component, platform)
  const { children = [], type, props = {} } = component

  const responsive = props.base || {}
  let openTag = ""
  let closeTag = ""
  let innerContent = ""

  switch (type) {
    case "Text":
      if (platform === "web") {
        openTag = `<div className="${mappedStyles.className || ""}">`
        innerContent = responsive.text || "Text"
        closeTag = `</div>`
      } else {
        openTag = `<Text style={${JSON.stringify(mappedStyles.style || {})}}>`
        innerContent = responsive.text || "Text"
        closeTag = `</Text>`
      }
      break
    case "Button":
      if (platform === "web") {
        openTag = `<button className="${mappedStyles.className || ""}">`
        innerContent = responsive.label || "Button"
        closeTag = `</button>`
      } else {
        openTag = `<Pressable style={${JSON.stringify(mappedStyles.style || {})}}><Text>${responsive.label || "Button"}</Text>`
        innerContent = ""
        closeTag = `</Pressable>`
      }
      break
    default:
      if (platform === "web") {
        openTag = `<div className="${mappedStyles.className || ""}">`
        closeTag = `</div>`
      } else {
        openTag = `<View style={${JSON.stringify(mappedStyles.style || {})}}>`
        closeTag = `</View>`
      }
  }

  const childrenJSX = children.map((c) => renderComponentJSX(c, platform)).join("\n")

  return `${openTag}${innerContent}\n${childrenJSX}${closeTag}`
}

// Page JSX
function renderPageJSX(page: BuilderSchema["pages"][number], platform: "web" | "react-native") {
  const content = page.components.map((c) => renderComponentJSX(c, platform)).join("\n")
  if (platform === "web") {
    return `
      import React from "react"
      export default function ${page.name.replace(/\s+/g, "")}() {
        return (<div className="w-full h-full">${content}</div>)
      }
    `
  } else {
    return `
      import React from "react"
      import { View, Text, Pressable } from "react-native"
      export default function ${page.name.replace(/\s+/g, "")}() {
        return (<View style={{flex:1}}>${content}</View>)
      }
    `
  }
}

// Copy assets folder to export
function copyAssets(sourceDir: string, destDir: string) {
  if (!fs.existsSync(sourceDir)) return
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true })

  const entries = fs.readdirSync(sourceDir, { withFileTypes: true })
  entries.forEach((entry) => {
    const srcPath = path.join(sourceDir, entry.name)
    const dstPath = path.join(destDir, entry.name)
    if (entry.isDirectory()) copyAssets(srcPath, dstPath)
    else fs.copyFileSync(srcPath, dstPath)
  })
}

// ===============================
// Builder Export Page
// ===============================

export default function ExportPage() {
  const pages = useBuilderStore((s) => s.pages)
  const [status, setStatus] = useState<string>("Idle")
  const [platform, setPlatform] = useState<"web" | "react-native">("web")
  const [outputDir, setOutputDir] = useState<string>("./exported-app")
  const [githubUrl, setGithubUrl] = useState<string>("")

  const handleExport = async () => {
    try {
      setStatus("Generating code...")
      if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true })

      // Pages
      const pagesDir = path.join(outputDir, "pages")
      if (!fs.existsSync(pagesDir)) fs.mkdirSync(pagesDir)

      // Asset copy
      const assetSource = path.resolve("./public/assets")
      const assetDest = path.join(outputDir, "public/assets")
      copyAssets(assetSource, assetDest)

      // Export pages
      for (const page of pages) {
        const pageJSX = renderPageJSX(page, platform)
        const filePath = path.join(pagesDir, `${page.name.replace(/\s+/g, "")}.tsx`)
        fs.writeFileSync(filePath, pageJSX, "utf-8")
      }

      // Error checking
      let unsupportedProps = 0
      pages.forEach((p) => {
        p.components.forEach((c) => {
          const propsKeys = Object.keys(c.props || {})
          propsKeys.forEach((k) => {
            if (!["base", "tablet", "mobile"].includes(k)) unsupportedProps++
          })
        })
      })
      if (unsupportedProps > 0) setStatus(`Warning: ${unsupportedProps} unsupported props detected`)

      // GitHub push
      if (githubUrl) {
        setStatus("Pushing to GitHub...")
        const git: SimpleGit = simpleGit(outputDir)
        if (!fs.existsSync(path.join(outputDir, ".git"))) {
          await git.init()
          await git.addRemote("origin", githubUrl)
        }
        await git.add(".")
        await git.commit(`Exported build ${nanoid(6)}`)
        await git.push("origin", "main")
      }

      setStatus("Export complete ✅")
    } catch (err: any) {
      setStatus("Error: " + err.message)
    }
  }

  return (
    <div className="p-6 space-y-4 w-full max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">Builder Exporter</h1>

      <div className="space-y-2">
        <label>Target Platform:</label>
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value as "web" | "react-native")}
          className="border px-2 py-1 rounded"
        >
          <option value="web">Next.js (Web)</option>
          <option value="react-native">React Native</option>
        </select>
      </div>

      <div className="space-y-2">
        <label>Output Directory:</label>
        <input
          type="text"
          value={outputDir}
          onChange={(e) => setOutputDir(e.target.value)}
          className="border px-2 py-1 rounded w-full"
        />
      </div>

      <div className="space-y-2">
        <label>GitHub Repo URL (Optional):</label>
        <input
          type="text"
          value={githubUrl}
          onChange={(e) => setGithubUrl(e.target.value)}
          className="border px-2 py-1 rounded w-full"
        />
      </div>

      <button
        onClick={handleExport}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Export Project
      </button>

      <div className="mt-4">
        <strong>Status:</strong> {status}
      </div>
    </div>
  )
}

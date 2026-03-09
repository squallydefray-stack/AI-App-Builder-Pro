//
//  nextProjectGenerator.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/24/26.
//


import { BuilderComponent, Breakpoint } from "@lib/exporter/schema"

/* =====================================================
   PUBLIC: GENERATE FULL NEXT.JS APP ROUTER PROJECT
===================================================== */

export function generateNextProject(
  components: BuilderComponent[],
  breakpoint: Breakpoint = "base"
): Record<string, string> {

  const pageComponent = buildPageComponent(components, breakpoint)

  return {
    "app/layout.tsx": buildLayout(),
    "app/page.tsx": buildAppPage(),
    "components/GeneratedPage.tsx": pageComponent,
    "app/globals.css": buildGlobalCSS(),
    "package.json": buildPackageJSON(),
    "tsconfig.json": buildTSConfig(),
    "next.config.js": buildNextConfig(),
  }
}

/* =====================================================
   PAGE COMPONENT
===================================================== */

function buildPageComponent(
  components: BuilderComponent[],
  breakpoint: Breakpoint
): string {

  const body = components.map(c => renderNode(c, breakpoint)).join("\n")

  return `
"use client"
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

/* =====================================================
   APP PAGE
===================================================== */

function buildAppPage(): string {
  return `
import GeneratedPage from "@/components/GeneratedPage"

export default function Page() {
  return <GeneratedPage />
}
`
}

/* =====================================================
   ROOT LAYOUT
===================================================== */

function buildLayout(): string {
  return `
import "./globals.css"
import React from "react"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
`
}

/* =====================================================
   GLOBAL CSS
===================================================== */

function buildGlobalCSS(): string {
  return `
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  width: 100%;
  height: 100%;
  font-family: sans-serif;
}
`
}

/* =====================================================
   PACKAGE.JSON
===================================================== */

function buildPackageJSON(): string {
  return JSON.stringify({
    name: "generated-app",
    private: true,
    scripts: {
      dev: "next dev",
      build: "next build",
      start: "next start"
    },
    dependencies: {
      next: "14.1.0",
      react: "^18",
      "react-dom": "^18"
    }
  }, null, 2)
}

/* =====================================================
   TSCONFIG
===================================================== */

function buildTSConfig(): string {
  return JSON.stringify({
    compilerOptions: {
      target: "es5",
      lib: ["dom", "dom.iterable", "esnext"],
      allowJs: true,
      skipLibCheck: true,
      strict: true,
      forceConsistentCasingInFileNames: true,
      noEmit: true,
      esModuleInterop: true,
      module: "esnext",
      moduleResolution: "bundler",
      resolveJsonModule: true,
      isolatedModules: true,
      jsx: "preserve"
    },
    include: ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
    exclude: ["node_modules"]
  }, null, 2)
}

/* =====================================================
   NEXT CONFIG
===================================================== */

function buildNextConfig(): string {
  return `
/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = nextConfig
`
}

/* =====================================================
   NODE RENDERING (Ultra Platinum)
===================================================== */

function renderNode(
  node: BuilderComponent,
  breakpoint: Breakpoint
): string {

  const props =
    node.propsPerBreakpoint[breakpoint] ||
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

/* =====================================================
   STYLE ENGINE
===================================================== */

function buildStyle(
  node: BuilderComponent,
  props: unknown
): Record<string, any> {

  const style: Record<string, any> = {}

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

  if (node.layout.constraints?.centerX) {
    style.marginLeft = "auto"
    style.marginRight = "auto"
  }

  if (node.layout.constraints?.centerY) {
    style.marginTop = "auto"
    style.marginBottom = "auto"
  }

  if (props.backgroundColor) style.backgroundColor = props.backgroundColor
  if (props.color) style.color = props.color
  if (props.borderRadius) style.borderRadius = props.borderRadius
  if (props.fontSize) style.fontSize = props.fontSize

  return style
}
// lib/exporter/codeGenerator.ts
// React Native Exporter

import { BuilderPage, BuilderComponent, BuilderSchema } from "./schema"
import { FileMap } from "./types"

/**
 * Convert style props to React Native inline style object
 */
function styleToReactNativeStyle(component: BuilderComponent): string {
  const style = component.props?.base || {}
  const styleEntries: string[] = []

  if (style.width !== undefined) styleEntries.push(`width: ${style.width}`)
  if (style.height !== undefined) styleEntries.push(`height: ${style.height}`)
  if (style.backgroundColor) styleEntries.push(`backgroundColor: "${style.backgroundColor}"`)
  if (style.color) styleEntries.push(`color: "${style.color}"`)
  if (style.fontSize) styleEntries.push(`fontSize: ${style.fontSize}`)
  if (style.fontWeight) styleEntries.push(`fontWeight: "${style.fontWeight}"`)
  if (style.padding) styleEntries.push(`padding: ${style.padding}`)
  if (style.borderRadius) styleEntries.push(`borderRadius: ${style.borderRadius}`)
  if (style.flexDirection) styleEntries.push(`flexDirection: "${style.flexDirection}"`)
  if (style.justifyContent) styleEntries.push(`justifyContent: "${style.justifyContent}"`)
  if (style.alignItems) styleEntries.push(`alignItems: "${style.alignItems}"`)

  return `{ ${styleEntries.join(", ")} }`
}

/**
 * Recursively render component tree to React Native JSX
 */
function componentToReactNativeJSX(component: BuilderComponent, depth = 2): string {
  const indent = "  ".repeat(depth)
  const style = styleToReactNativeStyle(component)

  let childrenJSX = ""
  if (component.children && component.children.length > 0) {
    childrenJSX = component.children.map(child => componentToReactNativeJSX(child, depth + 1)).join("\n")
  }

  const tag = component.type === "text" ? "Text" : "View"
  const content = component.props?.base?.text ?? ""

  if (!childrenJSX) {
    return `${indent}<${tag} style=${style}>${content}</${tag}>`
  }

  return `${indent}<${tag} style=${style}>\n${childrenJSX}\n${indent}</${tag}>`
}

/**
 * Convert BuilderSchema to React Native FileMap
 */
export function convertToReactNative(schema: BuilderSchema): FileMap {
  const files: FileMap = {}

  schema.pages.forEach((page: BuilderPage) => {
    const route = page.name === "Home" ? "App.tsx" : `${page.name}.tsx`
    const body = page.components.map(c => componentToReactNativeJSX(c)).join("\n")

    files[route] = `
import React from "react"
import { View, Text, StyleSheet } from "react-native"

export default function ${page.name.replace(/\s+/g, "")}() {
  return (
    <View style={styles.container}>
${body}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
})
`
  })

  return files
}
export function convertToNextTailwind(
  pages: BuilderPage[],
  options: NextTailwindExportOptions
): FileMap {
  const {
    appName,
    includeAppRouter = true,
    includeTailwindConfig = true,
  } = options

  const files: FileMap = {}

  // Root layout
  files["app/layout.tsx"] =
    rootLayout(appName)

  // Pages
  pages.forEach((page) => {
    const route =
      page.name === "Home"
        ? "app/page.tsx"
        : `app/${page.name.toLowerCase()}/page.tsx`

    files[route] =
      pageToComponent(page)
  })

  // Globals
  files["app/globals.css"] =
    globalsCSS()

  if (includeTailwindConfig) {
    files["tailwind.config.ts"] =
      tailwindConfig()
  }

  files["postcss.config.js"] = `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`

  files["package.json"] = JSON.stringify(
    {
      name: appName.toLowerCase(),
      private: true,
      scripts: {
        dev: "next dev",
        build: "next build",
        start: "next start",
      },
      dependencies: {
        next: "latest",
        react: "latest",
        "react-dom": "latest",
      },
      devDependencies: {
        tailwindcss: "^3.4.0",
        autoprefixer: "^10.4.0",
        postcss: "^8.4.0",
        typescript: "^5.0.0",
      },
    },
    null,
    2
  )

  files["tsconfig.json"] = JSON.stringify(
    {
      compilerOptions: {
        target: "esnext",
        lib: ["dom", "dom.iterable", "esnext"],
        allowJs: false,
        skipLibCheck: true,
        strict: true,
        forceConsistentCasingInFileNames: true,
        noEmit: true,
        module: "esnext",
        moduleResolution: "bundler",
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: "preserve",
      },
      include: ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
      exclude: ["node_modules"],
    },
    null,
    2
  )

  return files
}

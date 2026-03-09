// lib/exporter/convertToNextTailwind.ts
// AI App Builder Pro — Production Next.js + Tailwind Exporter

import { BuilderPage, BuilderComponent } from "@/lib/exporter/schema"

/* ============================================================
   TYPES
============================================================ */

export type NextTailwindExportOptions = {
  appName: string
  includeAppRouter?: boolean
  includeTailwindConfig?: boolean
}

export type FileMap = Record<string, string>

/* ============================================================
   BREAKPOINT MAP
============================================================ */

const breakpointPrefix = {
  base: "",
  tablet: "md:",
  mobile: "sm:",
}

/* ============================================================
   STYLE → TAILWIND CLASS CONVERTER
============================================================ */

function px(value?: number | string) {
  if (value === undefined || value === null) return ""
  return typeof value === "number" ? `${value}px` : value
}

function styleToTailwind(component: BuilderComponent): string {
  const style = component.props?.base ?? {}

  const classes: string[] = []

  if (style.display === "flex") {
    classes.push("flex")

    if (style.flexDirection === "column")
      classes.push("flex-col")
    else
      classes.push("flex-row")

    if (style.justifyContent)
      classes.push(
        `justify-${style.justifyContent}`
      )

    if (style.alignItems)
      classes.push(
        `items-${style.alignItems}`
      )

    if (style.gap)
      classes.push(`gap-[${px(style.gap)}]`)
  }

  if (style.backgroundColor)
    classes.push(`bg-[${style.backgroundColor}]`)

  if (style.color)
    classes.push(`text-[${style.color}]`)

  if (style.fontSize)
    classes.push(`text-[${px(style.fontSize)}]`)

  if (style.fontWeight)
    classes.push(`font-[${style.fontWeight}]`)

  if (style.padding)
    classes.push(`p-[${px(style.padding)}]`)

  if (style.borderRadius)
    classes.push(`rounded-[${px(style.borderRadius)}]`)

  if (style.width)
    classes.push(`w-[${px(style.width)}]`)

  if (style.height)
    classes.push(`h-[${px(style.height)}]`)

  if (style.position === "absolute") {
    classes.push("absolute")

    if (style.left !== undefined)
      classes.push(`left-[${px(style.left)}]`)

    if (style.top !== undefined)
      classes.push(`top-[${px(style.top)}]`)
  }

  return classes.join(" ")
}

/* ============================================================
   RESPONSIVE PROP MERGER
============================================================ */

function responsiveClasses(
  component: BuilderComponent
): string {
  const breakpoints =
    component.props ?? {}

  const classes: string[] = []

  Object.entries(breakpoints).forEach(
    ([bp, props]) => {
      const prefix =
        breakpointPrefix[bp as keyof typeof breakpointPrefix] ?? ""

      const localClasses =
        styleToTailwind({
          ...component,
          props: { base: props },
        })

      if (!localClasses) return

      localClasses
        .split(" ")
        .forEach((cls) => {
          if (prefix)
            classes.push(`${prefix}${cls}`)
          else classes.push(cls)
        })
    }
  )

  return classes.join(" ")
}

/* ============================================================
   COMPONENT → JSX
============================================================ */

function componentToJSX(
  component: BuilderComponent,
  depth = 2
): string {
  const indent = "  ".repeat(depth)
  const classes = responsiveClasses(component)

  const children =
    component.children?.length
      ? component.children
          .map((child) =>
            componentToJSX(child, depth + 1)
          )
          .join("\n")
      : ""

  const tag =
    component.type === "button"
      ? "button"
      : component.type === "text"
      ? "p"
      : "div"

  const content =
    component.props?.base?.text ?? ""

  if (!children) {
    return `${indent}<${tag} className="${classes}">
${indent}  ${content}
${indent}</${tag}>`
  }

  return `${indent}<${tag} className="${classes}">
${children}
${indent}</${tag}>`
}

if (component.type === "Repeater") {
  const data = component.props?.data || []
  const templateChild = component.children?.[0]

  if (!templateChild) return ""

  return `
    {${JSON.stringify(data)}.map((item, index) => (
      <React.Fragment key={index}>
        ${renderComponentWithScope(templateChild, "item")}
      </React.Fragment>
    ))}
  `
}

/* ============================================================
   PAGE GENERATOR
============================================================ */
function renderComponentWithScope(
  component: BuilderComponent,
  scopeVar: string
): string {
  const style = component.props?.base || {}

  const className = convertStyleToTailwind(style)

  if (component.type === "Text") {
    const raw = component.props?.base?.text || ""

    const parsed = raw.replace(/\{\{(.*?)\}\}/g, (_, expr) => {
      return `\${${scopeVar}.${expr.trim().replace("item.", "")}}`
    })

    return `<div className="${className}">{\`${parsed}\`}</div>`
  }

  return renderComponent(component)
}

function pageToComponent(page: BuilderPage) {
  const body = page.components
    .map((component) =>
      componentToJSX(component, 2)
    )
    .join("\n")

  return `export default function Page() {
  return (
    <main className="relative min-h-screen w-full">
${body}
    </main>
  )
}`
}

/* ============================================================
   ROOT LAYOUT
============================================================ */

function rootLayout(appName: string) {
  return `import "./globals.css"

export const metadata = {
  title: "${appName}",
  description: "Generated by AI App Builder Pro",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white">
        {children}
      </body>
    </html>
  )
}`
}

/* ============================================================
   GLOBALS
============================================================ */

function globalsCSS() {
  return `@tailwind base;
@tailwind components;
@tailwind utilities;

html, body {
  padding: 0;
  margin: 0;
}`
}

function tailwindConfig() {
  return `import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

export default config`
}

/* ============================================================
   MAIN EXPORT FUNCTION
============================================================ */

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

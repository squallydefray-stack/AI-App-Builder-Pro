// export/next/generateNext.ts
import { BuilderPage, BuilderComponent } from "@lib/exporter/schema"
import { componentTemplates } from "./componentTemplates"
import { v4 as uuid } from "uuid"

interface ProjectFile {
  path: string
  content: string
}

/**
 * Converts Builder snapshot → array of Next.js project files
 */
export async function generateNextProject(pages: BuilderPage[]): Promise<ProjectFile[]> {
  const files: ProjectFile[] = []

  // -------------------------------
  // 1️⃣ package.json
  // -------------------------------
  files.push({
    path: "package.json",
    content: JSON.stringify(
      {
        name: "ai-builder-export",
        version: "0.1.0",
        private: true,
        scripts: {
          dev: "next dev",
          build: "next build",
          start: "next start",
        },
        dependencies: {
          next: "16.1.6",
          react: "19.2.3",
          "react-dom": "19.2.3",
          tailwindcss: "^4.0.0",
        },
      },
      null,
      2
    ),
  })

  // -------------------------------
  // 2️⃣ next.config.js
  // -------------------------------
  files.push({
    path: "next.config.js",
    content: `/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  experimental: { appDir: true },
}
`,
  })

  // -------------------------------
  // 3️⃣ TailwindCSS config
  // -------------------------------
  files.push({
    path: "tailwind.config.js",
    content: `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: { extend: {} },
  plugins: [],
}
`,
  })

  // -------------------------------
  // 4️⃣ app/globals.css
  // -------------------------------
  files.push({
    path: "app/globals.css",
    content: `@tailwind base;
@tailwind components;
@tailwind utilities;`,
  })

  // -------------------------------
  // 5️⃣ app/layout.tsx
  // -------------------------------
  files.push({
    path: "app/layout.tsx",
    content: `import './globals.css'

export const metadata = { title: 'AI Builder App' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
`,
  })

  // -------------------------------
  // 6️⃣ Components folder
  // -------------------------------
  files.push({
    path: "components/Button.tsx",
    content: `export default function Button({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={onClick}>
      {children}
    </button>
  )
}
`,
  })

  // -------------------------------
  // 7️⃣ Generate pages
  // -------------------------------
  for (const page of pages) {
    const pagePath = `app/${page.slug || page.name}/page.tsx`
    const pageContent = generatePageContent(page)
    files.push({ path: pagePath, content: pageContent })
  }

  return files
}

// ------------------------------------
// Generate page content recursively
// ------------------------------------
function generatePageContent(page: BuilderPage): string {
  const pageName = page.name.replace(/\s+/g, "")

  const renderComponent = (comp: BuilderComponent): string => {
    const template = componentTemplates[comp.type]
    if (!template) return `<div key="${comp.id}">[Unsupported: ${comp.type}]</div>`

    // Merge responsive classes
    const responsiveClasses = ["base", "tablet", "mobile"]
      .map((bp) => {
        const cls = comp.props[bp]?.className || ""
        if (bp === "base") return cls
        if (bp === "tablet") return cls ? `md:${cls}` : ""
        if (bp === "mobile") return cls ? `sm:${cls}` : ""
        return ""
      })
      .filter(Boolean)
      .join(" ")

    const compWithResponsive = {
      ...comp,
      props: {
        ...comp.props,
        base: { ...comp.props.base, className: responsiveClasses },
      },
    }

    // Render children recursively if any
    if (comp.children && comp.children.length > 0) {
      const childrenStr = comp.children.map(renderComponent).join("\n")
      return `<div key="${comp.id}" className="${compWithResponsive.props.base.className}">
${childrenStr}
</div>`
    }

    // Render component via template
    return template.render(compWithResponsive)
  }

  const componentsStr = page.components.map(renderComponent).join("\n")

  return `export default function ${pageName}Page() {
  return (
    <main className="p-4 space-y-4">
      ${componentsStr}
    </main>
  )
}
`
}

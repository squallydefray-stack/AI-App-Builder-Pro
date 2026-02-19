// lib/exporter/nextjsExporter.ts

import JSZip from "jszip"
import { ExportComponent } from "./normalizer"
import { generatePageComponent } from "./componentGenerator"

export type NextExportInput = {
  pages: {
    name: string
    components: ExportComponent[]
  }[]
}

function generateLayout(): string {
  return `export const metadata = {
  title: "Generated App",
  description: "Built with AI App Builder Pro",
}

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

function generatePackageJSON(): string {
  return JSON.stringify(
    {
      name: "ai-app-builder-export",
      version: "1.0.0",
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
    },
    null,
    2
  )
}

function generateTSConfig(): string {
  return JSON.stringify(
    {
      compilerOptions: {
        target: "ES6",
        lib: ["dom", "dom.iterable", "esnext"],
        allowJs: true,
        skipLibCheck: true,
        strict: false,
        forceConsistentCasingInFileNames: true,
        noEmit: true,
        esModuleInterop: true,
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
}

export async function exportNextJSApp(input: NextExportInput): Promise<Blob> {
  const zip = new JSZip()

  // root files
  zip.file("package.json", generatePackageJSON())
  zip.file("tsconfig.json", generateTSConfig())
  zip.file("app/layout.tsx", generateLayout())

  // pages
  input.pages.forEach((page) => {
    const fileName =
      page.name.toLowerCase() === "home"
        ? "app/page.tsx"
        : `app/${page.name.toLowerCase()}/page.tsx`

    const pageCode = generatePageComponent(page.name, page.components)
    zip.file(fileName, pageCode)
  })

  return await zip.generateAsync({ type: "blob" })
}

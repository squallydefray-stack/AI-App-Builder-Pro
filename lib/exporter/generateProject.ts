//
//  generateProject.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/14/26.
//


import JSZip from "jszip"
import { BuilderComponent } from "@lib/exporter/schema"
import { generatePage } from "./generatePage"

export async function generateProject(pages: { name: string; components: BuilderComponent[] }[]) {
  const zip = new JSZip()

  // Add package.json
  zip.file(
    "package.json",
    JSON.stringify(
      {
        name: "exported-app",
        version: "1.0.0",
        scripts: {
          dev: "next dev",
          build: "next build",
          start: "next start",
        },
        dependencies: {
          react: "^19.0.0",
          "react-dom": "^19.0.0",
          next: "^16.0.0",
        },
      },
      null,
      2
    )
  )

  // Add next.config.js
  zip.file(
    "next.config.js",
    `
/** @type {import('next').NextConfig} */
const nextConfig = {}
module.exports = nextConfig
`
  )

  // Add Tailwind base
  zip.file(
    "styles/tailwind.css",
    `
@tailwind base;
@tailwind components;
@tailwind utilities;
`
  )

  // Add pages
  for (const page of pages) {
    zip.file(`app/${page.name}.tsx`, generatePage(page.components))
  }

  return zip
}

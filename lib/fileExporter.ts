//
//  fileExporter.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/17/26.
//


import { BuilderSchema } from "@lib/exporter/schema"
import fs from "fs"
import path from "path"

export async function copyAssets(schema: BuilderSchema) {
  // iterate pages/components and copy images/fonts/icons to `./exported_assets`
  schema.pages.forEach((page) => {
    page.components.forEach((c) => {
      // simulate copying; in real usage, handle actual file paths
      console.log("Copying asset for component:", c.id)
    })
  })
}

export async function exportToLocalFiles(schema: BuilderSchema): Promise<string[]> {
  const exportDir = path.join(process.cwd(), "exports")
  if (!fs.existsSync(exportDir)) fs.mkdirSync(exportDir)

  fs.writeFileSync(path.join(exportDir, "schema.json"), JSON.stringify(schema, null, 2))

  // Example: collect unsupported props for warning
  const unsupportedProps: string[] = []
  schema.pages.forEach((p) =>
    p.components.forEach((c) => {
      if (c.props.base?.unsupported) unsupportedProps.push(`Component ${c.id} has unsupported props`)
    })
  )

  return unsupportedProps
}

//
//  export.js
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/18/26.
//


/**
 * scripts/export.js
 *
 * Usage:
 *   node scripts/export.js [nextjs|reactnative]
 *
 * Exports all Builder pages locally to the specified platform
 */

import path from "path"
import fs from "fs/promises"
import { exportToNextJS, exportToReactNative } from "../lib/exporter/exporterAPI.js"
import { useBuilderStore } from "@/state/builderStore.js"

async function main() {
  const platform = process.argv[2] || "nextjs"
  console.log(`Exporting Builder pages for platform: ${platform}`)

  // Get latest snapshot from builderStore
  const pages = useBuilderStore.getState().getSnapshotForExport()
  if (!pages?.length) {
    console.error("No pages found in BuilderStore!")
    process.exit(1)
  }

  let output
  if (platform === "nextjs") {
    output = await exportToNextJS(pages)
  } else if (platform === "reactnative") {
    output = await exportToReactNative(pages)
  } else {
    console.error("Invalid platform. Use 'nextjs' or 'reactnative'.")
    process.exit(1)
  }

  console.log(`Export complete! Files written to: ${output.outputPath}`)
}

main().catch((err) => {
  console.error("Export failed:", err)
  process.exit(1)
})

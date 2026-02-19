//
//  exportToZip.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/14/26.
//


import JSZip from "jszip"
import { saveAs } from "file-saver"

type FileMap = Record<string, string>

export async function exportToZip(files: FileMap, zipName = "ai-builder-export.zip") {
  const zip = new JSZip()

  Object.entries(files).forEach(([filePath, content]) => {
    zip.file(filePath, content)
  })

  const blob = await zip.generateAsync({ type: "blob" })
  saveAs(blob, zipName)
}

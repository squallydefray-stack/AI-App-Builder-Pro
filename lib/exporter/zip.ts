/* =============================
ZIP GENERATOR
============================= */

import JSZip from "jszip"

export async function buildZip(files: Record<string, string>) {
  const zip = new JSZip()

  Object.entries(files).forEach(([path, content]) => {
    zip.file(path, content)
  })

  return zip.generateAsync({ type: "blob" })
}

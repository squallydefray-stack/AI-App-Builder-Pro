//
//  zipHelper.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/13/26.
//


import archiver from "archiver"
import fs from "fs"

export async function zipFolder(folderPath: string, zipPath: string) {
  return new Promise<void>((resolve, reject) => {
    const output = fs.createWriteStream(zipPath)
    const archive = archiver("zip", { zlib: { level: 9 } })

    output.on("close", () => resolve())
    archive.on("error", (err) => reject(err))

    archive.pipe(output)
    archive.directory(folderPath, false)
    archive.finalize()
  })
}

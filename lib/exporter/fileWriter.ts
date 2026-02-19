//  lib/exporter/fileWriter.ts
//  fileWriter.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/13/26.
//


import fs from "fs"
import path from "path"
import os from "os"
import { promisify } from "util"
import archiver from "archiver"

const mkdir = promisify(fs.mkdir)
const writeFile = promisify(fs.writeFile)

export async function writeFilesToTempDir(files: { path: string; content: string }[]) {
  const tempDir = path.join(os.tmpdir(), `ai-builder-${Date.now()}`)
  await mkdir(tempDir, { recursive: true })

  for (const file of files) {
    const filePath = path.join(tempDir, file.path)
    await mkdir(path.dirname(filePath), { recursive: true })
    await writeFile(filePath, file.content, "utf-8")
  }

  return tempDir
}

export async function zipDirectory(folderPath: string) {
  const zipPath = `${folderPath}.zip`
  const output = fs.createWriteStream(zipPath)
  const archive = archiver("zip", { zlib: { level: 9 } })

  return new Promise<string>((resolve, reject) => {
    output.on("close", () => resolve(zipPath))
    archive.on("error", (err) => reject(err))

    archive.pipe(output)
    archive.directory(folderPath, false)
    archive.finalize()
  })
}

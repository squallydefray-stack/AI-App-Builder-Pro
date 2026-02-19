// export/zip/zipProject.ts
import { BuilderSchema } from "@lib/exporter/schema"
import { generateNextProject } from "../next/generateNext"
import { writeFilesToTempDir, zipDirectory } from "../fileWriter"

export async function zipProject(schema: BuilderSchema) {
  const fileMap = generateNextProject(schema)

  const files = Object.entries(fileMap).map(([path, content]) => ({
    path,
    content
  }))

  const tempDir = await writeFilesToTempDir(files)
  const zipPath = await zipDirectory(tempDir)

  return zipPath
}

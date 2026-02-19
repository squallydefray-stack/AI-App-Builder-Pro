import { NextResponse } from "next/server"
import { writeFilesToTempDir, zipDirectory } from "@lib/exporter/fileWriter"
import { generateNextProject } from "@export/next/generateNext"
import { getBuilderSnapshot } from "@state/builderStore" // your helper to get current pages

export async function POST() {
  try {
    // 1️⃣ Get the Builder snapshot
    const pages = getBuilderSnapshot() // returns BuilderPage[]

    if (!pages || pages.length === 0) {
      return NextResponse.json({ error: "No pages to export" }, { status: 400 })
    }

    // 2️⃣ Generate Next.js project files
    const projectFiles = await generateNextProject(pages)

    // 3️⃣ Write files to temporary folder
    const tempDir = await writeFilesToTempDir(projectFiles)

    // 4️⃣ Zip the folder
    const zipPath = await zipDirectory(tempDir)

    // 5️⃣ Return the zip file as a download
    const zipData = await fetch(`file://${zipPath}`).then((res) => res.arrayBuffer())

    return new NextResponse(zipData, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename=ai-builder-export.zip`,
      },
    })
  } catch (err: any) {
    console.error("Export failed:", err)
    return NextResponse.json({ error: err.message || "Export failed" }, { status: 500 })
  }
}

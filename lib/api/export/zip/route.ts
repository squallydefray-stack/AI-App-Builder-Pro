// app/api/export/zip/route.ts
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { generateNextProject } from "@export/next/generateNext"
import { writeFilesToTempDir, zipDirectory } from "@export/fileWriter"
import fs from "fs"

const PromptSchema = z.object({
  prompt: z.string().min(5, "Prompt must be at least 5 characters"),
  projectName: z.string().min(1, "Project name is required")
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { prompt, projectName } = PromptSchema.parse(body)

    // 1️⃣ Generate BuilderSchema using AI module
    const { generateAppFromPrompt } = await import("@ai/generateAppFromPrompt")
    const schema = await generateAppFromPrompt(prompt)

    // Optional: overwrite schema name with projectName
    schema.name = projectName

    // 2️⃣ Generate Next.js project files
    const fileMap = generateNextProject(schema)
    const files = Object.entries(fileMap).map(([path, content]) => ({
      path,
      content
    }))

    // 3️⃣ Write files to temp directory
    const tempDir = await writeFilesToTempDir(files)

    // 4️⃣ Zip the directory
    const zipPath = await zipDirectory(tempDir)

    // 5️⃣ Stream the ZIP file back to client
    const zipBuffer = fs.readFileSync(zipPath)

    return new NextResponse(zipBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename=${projectName}.zip`,
        "Content-Length": zipBuffer.length.toString()
      }
    })
  } catch (err: any) {
    console.error("ZIP Export Error:", err)
    const message =
      err instanceof z.ZodError
        ? err.errors.map(e => e.message).join(", ")
        : err.message || "Unknown error"
    return NextResponse.json({ success: false, error: message }, { status: 400 })
  }
}

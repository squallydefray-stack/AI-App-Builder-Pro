//
//  pipeline.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/13/26.
//


// lib/exporter/pipeline.ts
import path from "path"
import { writeProjectFiles } from "./fileWriter"
import { zipFolder } from "./zipHelper"
import { generateAppFiles } from "./generateAppFiles"
import { getGithubToken } from "@/lib/github/auth"
import { createGithubRepo, pushFilesToGithub } from "@/lib/github/client"

export async function exportPipeline(req: Request, progress: (msg: string) => Promise<void>) {
  try {
    // 1️⃣ Get builder schema from request (includes responsive props)
    const { pages } = await req.json()
    const schema = { pages }

    await progress("Generating project files (responsive props included)...")
    const files = generateAppFiles(schema)

    // 2️⃣ Write files locally
    const outputDir = path.join("/tmp", `ai-builder-${Date.now()}`)
    writeProjectFiles(outputDir, files)
    await progress("Project files written to server.")

    // 3️⃣ Create ZIP
    const zipPath = path.join(outputDir, "ai-builder.zip")
    await zipFolder(outputDir, zipPath)
    await progress("ZIP archive created.")

    // 4️⃣ GitHub export
    const userSession = await getGithubToken(req)
    const token = userSession.accessToken
    const repoName = `ai-builder-${Date.now()}`
    const repo = await createGithubRepo(token, repoName)
    await progress(`GitHub repo created: ${repo.html_url}`)

    await pushFilesToGithub(token, repo.name, files)
    await progress(`GitHub push complete! Repo URL: ${repo.html_url}`)

    // 5️⃣ Send download link
    const downloadUrl = `/api/export/download?file=${encodeURIComponent(zipPath)}`
    await progress(`ZIP ready: ${downloadUrl}`)
  } catch (err: any) {
    await progress(`Error: ${err.message}`)
  }
}

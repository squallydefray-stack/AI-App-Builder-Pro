// app/api/export/github/route.ts
import { NextResponse } from "next/server"
import { getBuilderSnapshot } from "@state/builderStore"
import { generateNextProject } from "@export/next/generateNext"
import { createRepoAndPush } from "@lib/github"

export async function POST() {
  try {
    const pages = getBuilderSnapshot()
    if (!pages || pages.length === 0)
      return NextResponse.json({ error: "No pages to export" }, { status: 400 })

    const projectFiles = await generateNextProject(pages)

    const repoName = `ai-builder-export-${Date.now()}`
    const repoUrl = await createRepoAndPush(repoName, projectFiles)

    return NextResponse.json({ message: "Repo created & pushed!", repoUrl })
  } catch (err: any) {
    console.error("GitHub export failed:", err)
    return NextResponse.json({ error: err.message || "GitHub export failed" }, { status: 500 })
  }
}

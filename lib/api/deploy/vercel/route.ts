//
//  route.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/19/26.
//


import { NextResponse } from "next/server"
import { getBuilderSnapshot } from "@state/builderStore"
import { generateNextProject } from "@export/next/generateNext"
import { createRepoAndPush } from "@lib/github"
import { deployToVercel } from "@lib/vercel"

export async function POST() {
  try {
    const pages = getBuilderSnapshot()
    if (!pages || pages.length === 0)
      return NextResponse.json({ error: "No pages to deploy" }, { status: 400 })

    // 1️⃣ Generate Next.js project files
    const projectFiles = await generateNextProject(pages)

    // 2️⃣ Create GitHub repo and push code
    const repoName = `ai-builder-${Date.now()}`
    const repoUrl = await createRepoAndPush(repoName, projectFiles)

    // 3️⃣ Deploy to Vercel
    const projectName = `${process.env.VERCEL_PROJECT_NAME_PREFIX}-${Date.now()}`
    const liveUrl = await deployToVercel({ repoUrl, projectName })

    return NextResponse.json({
      message: "Deployment successful!",
      repoUrl,
      liveUrl,
    })
  } catch (err: any) {
    console.error("Vercel deployment failed:", err)
    return NextResponse.json({ error: err.message || "Deployment failed" }, { status: 500 })
  }
}

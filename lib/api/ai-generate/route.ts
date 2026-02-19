//
//  route.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/19/26.
//


// app/api/ai-generate/route.ts
import { NextResponse } from "next/server"
import { BuilderPage } from "@lib/exporter/schema"
import { generateNextProject } from "@export/next/generateNext"
import { createRepoAndPush } from "@lib/github"
import { deployToVercel } from "@lib/vercel"
import { generateBuilderSchemaFromPrompt } from "@ai/layout/aiLayoutGenerator"

interface AIRequest {
  prompt: string
}

export async function POST(req: Request) {
  try {
    const body: AIRequest = await req.json()
    if (!body.prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    // 1️⃣ Generate Builder schema from AI prompt
    const pages: BuilderPage[] = await generateBuilderSchemaFromPrompt(body.prompt)
    if (!pages || pages.length === 0) {
      return NextResponse.json({ error: "AI did not generate any pages" }, { status: 500 })
    }

    // 2️⃣ Generate Next.js project files
    const projectFiles = await generateNextProject(pages)

    // 3️⃣ Create GitHub repo and push
    const repoName = `ai-builder-${Date.now()}`
    const repoUrl = await createRepoAndPush(repoName, projectFiles)

    // 4️⃣ Deploy to Vercel
    const liveUrl = await deployToVercel({
      repoUrl,
      projectName: `ai-builder-${Date.now()}`,
    })

    return NextResponse.json({
      message: "AI-generated app deployed!",
      repoUrl,
      liveUrl,
    })
  } catch (err: any) {
    console.error("AI generation & deployment failed:", err)
    return NextResponse.json({ error: err.message || "AI generation failed" }, { status: 500 })
  }
}

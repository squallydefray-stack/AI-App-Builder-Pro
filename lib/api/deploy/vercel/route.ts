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
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

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

    // 4️⃣ Store deployment in Supabase
    const { data, error } = await supabase.from("deployments").insert({
      project_id: null, // add if you have project IDs
      deployment_id: projectName, // or Vercel deployment ID
      live_url: liveUrl,
    }).select().single()

    if (error) {
      console.warn("Failed to save deployment:", error.message)
    }

let accumulatedLogs = ""

function appendLog(message: string) {
  accumulatedLogs += message + "\n"
}

appendLog("Starting deployment...")
appendLog(`Repo created: ${repoUrl}`)
appendLog("Deploying to Vercel...")

const liveUrl = await deployToVercel({ repoUrl, projectName })

appendLog(`Live at: ${liveUrl}`)
appendLog("Deployment complete")

await supabase.from("deployments").insert({
  deployment_id: projectName,
  live_url: liveUrl,
  logs: accumulatedLogs
})

    return NextResponse.json({
      message: "Deployment successful!",
      deploymentId: data?.deployment_id || projectName,
      liveUrl,
    })
  } catch (err: any) {
    console.error("Vercel deployment failed:", err)
    return NextResponse.json({ error: err.message || "Deployment failed" }, { status: 500 })
  }
}
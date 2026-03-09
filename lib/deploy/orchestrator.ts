//
//  orchestrator.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/19/26.
//


import { exportProject } from "@/lib/exporter/exportProject"
import { createRepoAndPush } from "@/lib/github/createRepo"
import { deployToVercel } from "@/lib/vercel/deploy"

export async function runDeployment(projectId: string, onLog: (msg: string) => void) {
  try {
    onLog("📦 Exporting project...")
    const files = await exportProject(projectId)

    onLog("📤 Creating GitHub repository...")
    const repo = await createRepoAndPush(files)

    onLog("🚀 Deploying to Vercel...")
    const deployment = await deployToVercel(repo.clone_url)

    onLog("✅ Deployment complete!")

    return {
      repoUrl: repo.html_url,
      liveUrl: deployment.url
    }
  } catch (err: unknown) {
    onLog("❌ Deployment failed")
    throw err
  }
}

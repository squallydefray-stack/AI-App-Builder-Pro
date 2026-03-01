// lib/vercel.ts
import axios from "axios"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface DeployToVercelOptions {
  repoUrl: string
  projectName: string
  deploymentId: string // pass the DB row ID to stream logs
}

export async function deployToVercel({
  repoUrl,
  projectName,
  deploymentId,
}: DeployToVercelOptions) {
  if (!process.env.VERCEL_TOKEN || !process.env.VERCEL_ORG_ID) {
    throw new Error("Missing VERCEL_TOKEN or VERCEL_ORG_ID")
  }

  let accumulatedLogs = ""

  function appendLog(message: string) {
    accumulatedLogs += message + "\n"
    // write to Supabase in real-time
    supabase
      .from("deployments")
      .update({ logs: accumulatedLogs })
      .eq("deployment_id", deploymentId)
      .then(({ error }) => {
        if (error) console.warn("Failed to update logs:", error.message)
      })
  }

  appendLog("⏳ Creating Vercel project...")
  const repoParts = repoUrl.split("/").slice(-2)
  const gitOrg = repoParts[0]
  const gitName = repoParts[1].replace(".git", "")

  // 1️⃣ Create project
  const createProjectRes = await axios.post(
    "https://api.vercel.com/v9/projects",
    {
      name: projectName,
      gitRepository: { type: "github", repo: `${gitOrg}/${gitName}`, productionBranch: "main" },
      framework: "nextjs",
    },
    {
      headers: { Authorization: `Bearer ${process.env.VERCEL_TOKEN}` },
    }
  )

  appendLog(`✅ Project created: ${projectName}`)

  // 2️⃣ Trigger deployment
  appendLog("🚀 Triggering deployment...")
  const deployRes = await axios.post(
    "https://api.vercel.com/v13/deployments",
    {
      name: projectName,
      gitSource: { type: "github", repoOrg: gitOrg, repoName: gitName, productionBranch: "main" },
    },
    {
      headers: { Authorization: `Bearer ${process.env.VERCEL_TOKEN}` },
    }
  )

  const deploymentIdVercel = deployRes.data.id
  const liveUrl = deployRes.data.url

  appendLog(`✅ Deployment created: ${deploymentIdVercel}`)

  // 3️⃣ Poll deployment status until ready
  appendLog("⏳ Waiting for deployment to complete...")
  let ready = false
  while (!ready) {
    await new Promise((r) => setTimeout(r, 5000)) // 5s interval
    const statusRes = await axios.get(
      `https://api.vercel.com/v13/deployments/${deploymentIdVercel}`,
      { headers: { Authorization: `Bearer ${process.env.VERCEL_TOKEN}` } }
    )
    const state = statusRes.data.state
    appendLog(`🔹 Deployment state: ${state}`)
    if (state === "READY") ready = true
    else if (state === "ERROR") {
      appendLog("❌ Deployment failed")
      throw new Error("Vercel deployment failed")
    }
  }

  appendLog(`🎉 Deployment ready: https://${liveUrl}`)

  // 4️⃣ Save final live URL to Supabase
  await supabase.from("deployments").update({ live_url: liveUrl }).eq("deployment_id", deploymentId)

  return { deploymentId: deploymentIdVercel, liveUrl }
}

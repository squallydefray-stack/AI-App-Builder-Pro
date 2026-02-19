import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@lib/supabaseClient"
import { writeFilesToTempDir, zipDirectory } from "@lib/exporter/fileWriter"
import { generateNextProject } from "@export/next/generateNext"
import { Octokit } from "@octokit/rest"
import fetch from "node-fetch"

interface DeployRequestBody {
  repoName: string
  builderSnapshot: any
  retryStep?: "export" | "github" | "vercel"
}

export async function POST(req: NextRequest) {
  const body: DeployRequestBody = await req.json()

  const user = await supabase.auth.getUser()
  if (!user.data.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { repoName, builderSnapshot, retryStep } = body

  try {
    // -------------------------------
    // 1️⃣ Export Builder → Next.js Project
    // -------------------------------
    const projectFiles = await generateNextProject(builderSnapshot)
    const tempDir = await writeFilesToTempDir(projectFiles)
    const zipPath = await zipDirectory(tempDir)
    console.log("✅ Project exported to:", zipPath)

    if (retryStep === "export") return NextResponse.json({ message: "Export successful" })

    // -------------------------------
    // 2️⃣ Push to GitHub via Octokit
    // -------------------------------
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })
    let repo
    try {
      repo = await octokit.repos.createForAuthenticatedUser({ name: repoName })
      console.log("✅ GitHub repo created:", repo.data.html_url)
    } catch (err: any) {
      if (err.status === 422) {
        // Repo already exists, retry step
        repo = await octokit.repos.get({ owner: user.data.user.user_metadata.user_name, repo: repoName })
      } else {
        throw err
      }
    }

    // Upload zip contents (simple method: commit all files)
    const fs = await import("fs")
    const path = await import("path")
    const files = fs.readdirSync(tempDir, { withFileTypes: true })
    for (const file of files) {
      if (file.isFile()) {
        const content = fs.readFileSync(path.join(tempDir, file.name), "utf-8")
        await octokit.repos.createOrUpdateFileContents({
          owner: user.data.user.user_metadata.user_name,
          repo: repoName,
          path: file.name,
          message: `Initial commit: ${file.name}`,
          content: Buffer.from(content).toString("base64"),
          branch: "main",
        })
      }
    }

    if (retryStep === "github") return NextResponse.json({ message: "GitHub push successful", repoUrl: repo.data.html_url })

    // -------------------------------
    // 3️⃣ Trigger Vercel Deploy
    // -------------------------------
    const vercelToken = process.env.VERCEL_TOKEN
    const vercelProject = repoName
    const vercelResponse = await fetch("https://api.vercel.com/v13/deployments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${vercelToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: vercelProject,
        gitSource: { type: "github", repoOrg: user.data.user.user_metadata.user_name, repoName },
      }),
    })

    const deployData = await vercelResponse.json()
    const deploymentUrl = deployData.url ? `https://${deployData.url}` : null
    console.log("✅ Deployed to Vercel:", deploymentUrl)

    // -------------------------------
    // 4️⃣ Save Deploy History
    // -------------------------------
    await supabase.from("deploys").insert({
      user_id: user.data.user.id,
      repo_name: repoName,
      repo_url: repo.data.html_url,
      deployment_url: deploymentUrl,
      created_at: new Date(),
    })

    return NextResponse.json({ repoUrl: repo.data.html_url, deploymentUrl })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message || "Deployment failed" }, { status: 500 })
  }
}

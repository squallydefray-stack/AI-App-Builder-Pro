// app/api/export/github-progress/route.ts
//  route.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/13/26.
//

import { getGithubToken } from "@/lib/github/auth"
import { Octokit } from "octokit"

export async function POST(req: Request) {
  const token = await getGithubToken(req)
  if (!token) return new Response("Unauthorized", { status: 401 })

  const { files } = await req.json() as { files: Record<string, string> }

  try {
    // 1️⃣ Create a new repo
    const octokit = new Octokit({ auth: token })
    const repoName = `ai-builder-${Date.now()}`
    const repo = await octokit.rest.repos.createForAuthenticatedUser({
      name: repoName,
      private: true,
    })

    // 2️⃣ Push files
    const branch = "main"
    for (const [path, content] of Object.entries(files)) {
      await octokit.rest.repos.createOrUpdateFileContents({
        owner: repo.data.owner.login,
        repo: repo.data.name,
        path,
        message: `Add ${path}`,
        content: Buffer.from(content).toString("base64"),
        branch,
      })
    }

    // 3️⃣ Return the repo URL
    return new Response(JSON.stringify({ url: repo.data.html_url }))
  } catch (err: any) {
    console.error("GitHub export error:", err)
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
}

//
//  client.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/13/26.
//


// lib/github/client.ts
import { Octokit } from "octokit"

export async function createGithubRepo(token: string, name: string) {
  const octo = new Octokit({ auth: token })
  const res = await octo.request("POST /user/repos", {
    name,
    private: false,
  })
  return res.data
}

export async function pushFilesToGithub(token: string, repoName: string, files: Record<string, string>) {
  const octo = new Octokit({ auth: token })

  const ownerRes = await octo.request("GET /user")
  const owner = ownerRes.data.login

  // Convert files to commits
  for (const [filePath, content] of Object.entries(files)) {
    await octo.request("PUT /repos/{owner}/{repo}/contents/{path}", {
      owner,
      repo: repoName,
      path: filePath,
      message: `Add ${filePath}`,
      content: Buffer.from(content).toString("base64"),
    })
  }
}

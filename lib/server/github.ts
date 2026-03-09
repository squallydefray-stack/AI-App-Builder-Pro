//
//  github.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/17/26.
//


// server/github.ts
import { Octokit } from "@octokit/rest"
import fs from "fs"
import path from "path"

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })

export async function pushProjectToGitHub(repoName: string, folderPath: string) {
  // 1. Create repo
  const { data: repo } = await octokit.repos.createForAuthenticatedUser({ name: repoName })

  // 2. Upload files
  const files = fs.readdirSync(folderPath, { withFileTypes: true })
  for (const file of files) {
    const filePath = path.join(folderPath, file.name)
    const content = fs.readFileSync(filePath, "utf-8")
    await octokit.repos.createOrUpdateFileContents({
      owner: repo.owner.login,
      repo: repo.name,
      path: file.name,
      message: `Initial commit`,
      content: Buffer.from(content).toString("base64"),
    })
  }

  return repo.html_url
}

//
//  export.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/13/26.
//


import { Octokit } from "octokit"

export async function exportToGithubRepo(token: string, files: { path: string; content: string }[]) {
  const octokit = new Octokit({ auth: token })
  const repoName = `ai-builder-${Date.now()}`

  // 1️⃣ Create repo
  const { data: repo } = await octokit.rest.repos.createForAuthenticatedUser({
    name: repoName,
    private: false,
  })

  // 2️⃣ Push files (simplest: commit each file via API)
  const mainBranch = "main"
  await octokit.rest.git.createRef({
    owner: repo.owner.login,
    repo: repo.name,
    ref: `refs/heads/${mainBranch}`,
    sha: (await octokit.rest.git.getRef({ owner: repo.owner.login, repo: repo.name, ref: `heads/main` }).catch(() => ({ data: { object: { sha: "" } } }))).data.object.sha,
  }).catch(() => {})

  for (const file of files) {
    await octokit.rest.repos.createOrUpdateFileContents({
      owner: repo.owner.login,
      repo: repo.name,
      path: file.path,
      message: `Add ${file.path}`,
      content: Buffer.from(file.content).toString("base64"),
      branch: mainBranch,
    })
  }

  return repo.html_url
}

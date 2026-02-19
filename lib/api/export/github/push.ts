

import { Octokit } from "@octokit/rest"

export async function pushFilesToGithub(token: string, repoName: string, files: Record<string, string>) {
  const octokit = new Octokit({ auth: token })

  // Create initial commit
  const { data: repo } = await octokit.repos.get({ owner: "your-username", repo: repoName })

  // Get default branch SHA
  const { data: ref } = await octokit.git.getRef({ owner: repo.owner.login, repo: repo.name, ref: "heads/main" })

  const baseSha = ref.object.sha

  // Commit each file
  for (const path in files) {
    await octokit.repos.createOrUpdateFileContents({
      owner: repo.owner.login,
      repo: repo.name,
      path,
      message: `Add ${path}`,
      content: Buffer.from(files[path]).toString("base64"),
      branch: "main",
      sha: undefined, // undefined for new files
    })
  }
}

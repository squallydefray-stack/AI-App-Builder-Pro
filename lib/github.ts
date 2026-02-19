/* =============================
GITHUB EXPORTER
============================= */

import { Octokit } from "@octokit/rest"
import fs from "fs"
import path from "path"

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })

/**
 * Create a new repo and push files
 */
export async function createRepoAndPush(repoName: string, files: { path: string; content: string }[]) {
  // 1️⃣ Create repo
  await octokit.repos.createForAuthenticatedUser({
    name: repoName,
    private: false,
  })

  // 2️⃣ Initialize main branch locally in temp dir
  const tempDir = path.join("/tmp", `repo-${repoName}-${Date.now()}`)
  fs.mkdirSync(tempDir, { recursive: true })

  for (const file of files) {
    const filePath = path.join(tempDir, file.path)
    fs.mkdirSync(path.dirname(filePath), { recursive: true })
    fs.writeFileSync(filePath, file.content, "utf-8")
  }

  // 3️⃣ Use simple-git to push
  const simpleGit = (await import("simple-git")).default
  const git = simpleGit(tempDir)

  await git.init()
  await git.addRemote("origin", `https://github.com/${process.env.GITHUB_USERNAME}/${repoName}.git`)
  await git.add(".")
  await git.commit("Initial commit from AI Builder")
  await git.push("origin", "main", { "--force": null })

  return `https://github.com/${process.env.GITHUB_USERNAME}/${repoName}`
}

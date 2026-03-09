// lib/exporter/exporterGit.ts
"use server"

import simpleGit from "simple-git"

export async function pushToGitHub(folderPath: string) {
  const git = simpleGit()
  await git.add(folderPath)
  const commit = await git.commit(`Exported app - ${new Date().toISOString()}`)
  await git.push()
  return { commitHash: commit.commit }
}

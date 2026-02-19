//
//  githubPush.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/17/26.
//


import simpleGit from "simple-git"

interface GitPushOptions {
  repo: string
  branch: string
  commitMessage: string
}

export async function pushToGitHub(options: GitPushOptions) {
  try {
    const git = simpleGit()
    await git.add(".")
    await git.commit(options.commitMessage)
    await git.push("origin", options.branch)
    return { success: true }
  } catch (err: any) {
    return { success: false, message: err.message }
  }
}

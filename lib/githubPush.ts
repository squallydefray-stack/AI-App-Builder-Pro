// githubPush.ts
// AI-App-Builder-Pro

import simpleGit from "simple-git"

export interface GitPushOptions {
  branch: string
  commitMessage: string
  schema?: unknown               // allow passing BuilderSchema
  platform?: "nextjs" | "reactnative"  // optional platform
  repo?: string              // optional repo override
}

export async function pushToGitHub(options: GitPushOptions) {
  try {
    const { branch, commitMessage, schema } = options

    // Optional: use schema to generate files before committing
    if (schema) {
      // e.g., fs.writeFileSync("builder-schema.json", JSON.stringify(schema, null, 2))
      // console.log("Schema ready for export:", schema)  // TODO: remove before release
    }

    const git = simpleGit(options.repo)
    await git.add(".")
    await git.commit(commitMessage)
    await git.push("origin", branch)

    return { success: true }
  } catch (err: unknown) {
    return { success: false, error: err.message }
  }
}

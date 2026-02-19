//
//  githubFull.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/17/26.
//


import { NextRequest, NextResponse } from "next/server"
import { Octokit } from "@octokit/rest"
import fs from "fs"
import path from "path"

interface ExportPage {
  name: string
  route: string
  components: any[]
}

interface ExportRequest {
  repoName: string
  pages: ExportPage[]
  branch?: string
  commitMessage?: string
}

export async function POST(req: NextRequest) {
  try {
    const { repoName, pages, branch, commitMessage }: ExportRequest = await req.json()

    if (!process.env.GITHUB_TOKEN)
      return NextResponse.json({ error: "GITHUB_TOKEN not set" }, { status: 500 })

    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })
    const user = await octokit.rest.users.getAuthenticated()
    const username = user.data.login
    const targetRepo = `${username}/${repoName}`
    const targetBranch = branch || "ai-auto-update"

    // --- 1️⃣ Ensure repo exists ---
    try {
      await octokit.rest.repos.get({ owner: username, repo: repoName })
    } catch {
      await octokit.rest.repos.createForAuthenticatedUser({
        name: repoName,
        private: true,
      })
    }

    // --- 2️⃣ Get or create branch ---
    let baseSha: string
    try {
      const ref = await octokit.rest.git.getRef({ owner: username, repo: repoName, ref: `heads/${targetBranch}` })
      baseSha = ref.data.object.sha
    } catch {
      const mainRef = await octokit.rest.git.getRef({ owner: username, repo: repoName, ref: "heads/main" })
      baseSha = mainRef.data.object.sha
      await octokit.rest.git.createRef({
        owner: username,
        repo: repoName,
        ref: `refs/heads/${targetBranch}`,
        sha: baseSha,
      })
    }

    // --- 3️⃣ Create files for each page ---
    const tree = []

    for (const page of pages) {
      // 3a: Create page JSON
      tree.push({
        path: `pages/${page.name}.json`,
        mode: "100644",
        type: "blob",
        content: JSON.stringify(page, null, 2),
      })

      // 3b: Optionally create Next.js page file
      tree.push({
        path: `pages/${page.name}.tsx`,
        mode: "100644",
        type: "blob",
        content: `
          import React from 'react'
          import { BuilderComponentRenderer } from '../../builder/components/BuilderComponentRenderer'
          import data from './${page.name}.json'

          export default function ${page.name}Page() {
            return <BuilderComponentRenderer components={data.components} />
          }
        `,
      })

      // 3c: Add assets if any (images/icons/fonts)
      if (page.components?.length) {
        page.components.forEach((c, i) => {
          if (c.props?.base?.image) {
            tree.push({
              path: `public/assets/${c.id}-${i}.png`,
              mode: "100644",
              type: "blob",
              content: c.props.base.image, // base64 or path, adjust
            })
          }
        })
      }
    }

    // --- 4️⃣ Create Git Tree ---
    const newTree = await octokit.rest.git.createTree({
      owner: username,
      repo: repoName,
      tree,
      base_tree: baseSha,
    })

    // --- 5️⃣ Create Commit ---
    const commit = await octokit.rest.git.createCommit({
      owner: username,
      repo: repoName,
      message: commitMessage || `AI Builder Commit - ${new Date().toISOString()}`,
      tree: newTree.data.sha,
      parents: [baseSha],
    })

    // --- 6️⃣ Update branch ---
    await octokit.rest.git.updateRef({
      owner: username,
      repo: repoName,
      ref: `heads/${targetBranch}`,
      sha: commit.data.sha,
    })

    // --- 7️⃣ Return info ---
    return NextResponse.json({
      sha: commit.data.sha,
      url: `https://github.com/${targetRepo}/commit/${commit.data.sha}`,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

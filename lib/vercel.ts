//
//  vercel.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/19/26.
//


import fetch from "node-fetch"

interface VercelDeployOptions {
  repoUrl: string
  projectName: string
}

export async function deployToVercel({ repoUrl, projectName }: VercelDeployOptions) {
  const response = await fetch("https://api.vercel.com/v13/deployments", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: projectName,
      gitSource: {
        type: "github",
        repoId: repoUrl.replace("https://github.com/", ""),
        branch: "main",
      },
      orgId: process.env.VERCEL_ORG_ID,
      projectSettings: {
        framework: "nextjs",
      },
    }),
  })

  const data = await response.json()
  if (!response.ok) throw new Error(data.error || "Vercel deployment failed")
  return data.url || data.previewUrl
}

//
//  vercel.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/19/26.
//


// server/vercel.ts
import fetch from "node-fetch"

export async function deployToVercel(repoUrl: string) {
  const res = await fetch("https://api.vercel.com/v13/deployments", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: repoUrl.split("/").pop(),
      gitSource: "github",
      repo: repoUrl,
      target: "production",
    }),
  })

  return res.json()
}

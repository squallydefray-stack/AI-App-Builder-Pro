//
//  auth.ts
//  AiAppBuilderPro
//
//  Created by Squally Da Boss on 2/8/26.
//

// app/api/export/github/route.ts
import { getGithubToken } from "@/lib/github/auth"
import { exportToGithub } from "@/lib/github/export"

export async function POST(req: Request) {
  const token = await getGithubToken(req)
  const builderSchema = await req.json()
  const repoUrl = await exportToGithub(token, builderSchema)
  return new Response(JSON.stringify({ url: repoUrl }))
}

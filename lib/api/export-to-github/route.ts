// app/api/github/export-to-github/route.ts
import { NextRequest, NextResponse } from "next/server"
import { exportAndPushToGit } from "@/lib/exporter/exporterAPI"
import { BuilderPage } from "@/builder/state/builderStore"

export async function POST(req: NextRequest) {
  try {
    const body: { pages: BuilderPage[]; repoName?: string } = await req.json()
    const { pages } = body
    if (!pages?.length) return NextResponse.json({ error: "No pages provided" }, { status: 400 })

    const result = await exportAndPushToGit(pages)
    return NextResponse.json({ success: true, commitHash: result.commitHash })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message || "Export failed" }, { status: 500 })
  }
}

//
//  route.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/13/26.
//


import fs from "fs"
import path from "path"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const zipPath = url.searchParams.get("file")
  if (!zipPath || !fs.existsSync(zipPath)) {
    return NextResponse.json({ error: "ZIP file not found" }, { status: 404 })
  }

  const fileBuffer = fs.readFileSync(zipPath)
  return new Response(fileBuffer, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${path.basename(zipPath)}"`,
    },
  })
}

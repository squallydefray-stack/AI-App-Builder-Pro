//
//  route.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/13/26.
//


// app/api/export/github-progress/route.ts
import { NextRequest } from "next/server"
import { exportPipeline } from "@/lib/exporter/pipeline"

// SSE helper
function createSSE(res: Response) {
  res.headers.set("Content-Type", "text/event-stream")
  res.headers.set("Cache-Control", "no-cache")
  res.headers.set("Connection", "keep-alive")

  const send = async (msg: string) => {
    res.write(`data: ${msg}\n\n`)
  }

  return send
}

export async function POST(req: NextRequest) {
  const res = new Response(null, { status: 200 })
  const sendLog = createSSE(res)

  // Parse builder pages from request
  const body = await req.json()
  const pages = body.pages || []

  // Start export pipeline
  exportPipeline(
    new Request(req.url, { method: "POST", body: JSON.stringify({ pages }) }),
    sendLog
  ).catch(async (err) => {
    await sendLog(`Error: ${err.message}`)
  })

  return res
}

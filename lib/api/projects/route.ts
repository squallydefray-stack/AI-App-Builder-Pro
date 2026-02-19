//
//  route.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/18/26.
//


// app/api/collab/route.ts
import { NextResponse } from "next/server"
import { WebSocketServer } from "ws"
import * as Y from "yjs"

let wss: WebSocketServer | null = null

export async function GET() {
  if (!wss) {
    const port = 1234
    wss = new WebSocketServer({ port })

    console.log(`🟢 Yjs WebSocket server running on ws://localhost:${port}`)

    // Basic Yjs doc setup (can extend with rooms later)
    const doc = new Y.Doc()
    wss.on("connection", (socket) => {
      console.log("New client connected")

      socket.on("message", (message) => {
        // handle messages here if needed
      })

      socket.on("close", () => console.log("Client disconnected"))
    })
  }

  return NextResponse.json({ status: "ok" })
}

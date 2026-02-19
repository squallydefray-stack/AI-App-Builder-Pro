// server/y-websocket-server.js
import { WebSocketServer } from "ws"
import * as Y from "yjs"
import { setupWSConnection } from "y-websocket/bin/utils.js"

const wss = new WebSocketServer({ port: 1234 })

wss.on("connection", (conn, req) => {
  setupWSConnection(conn, req)
})

console.log("✅ Yjs WebSocket server running on ws://localhost:1234")

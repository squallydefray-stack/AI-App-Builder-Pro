//
//  deploy-ws-server.js
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/19/26.
//


import WebSocket, { WebSocketServer } from "ws"

const wssDeploy = new WebSocketServer({ port: 8081 })
console.log("🚀 Deploy WS server running on ws://localhost:8081")

// Broadcast helper
export function broadcastDeployLog(message) {
  wssDeploy.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: "deploy-log", message }))
    }
  })
}

// Optional: listen for client messages
wssDeploy.on("connection", (ws) => {
  console.log("New deploy client connected")
  ws.on("message", (msg) => {
    console.log("Client says:", msg.toString())
  })
  ws.on("close", () => console.log("Deploy client disconnected"))
})

// server.js
const WebSocket = require("ws")

const wss = new WebSocket.Server({ port: 3001 })

const users = new Map()

wss.on("connection", (ws) => {
  let userId = null

  ws.on("message", (message) => {
    let data
    try {
      data = JSON.parse(message.toString())
    } catch (err) {
      console.error("Invalid JSON:", message.toString())
      return
    }

    if (!userId && data.type === "join") {
      userId = data.userId
      users.set(userId, { color: data.color, highlights: [], hover: null, x: 0, y: 0 })
      broadcast(ws, { type: "delta", action: "join", user: { userId, color: data.color, highlights: [], hover: null, x: 0, y: 0 } })
      return
    }

    if (!userId) return

    const user = users.get(userId)
    if (!user) return

    let delta = { type: "delta" }

    switch (data.type) {
      case "highlight":
        user.highlights = data.ids
        delta = { ...delta, action: "highlight", userId, ids: data.ids, color: user.color }
        break
      case "hover":
        user.hover = data.id || null
        delta = { ...delta, action: "hover", userId, id: user.hover }
        break
      case "cursor":
        user.x = data.x
        user.y = data.y
        delta = { ...delta, action: "cursor", userId, x: user.x, y: user.y, color: user.color }
        break
    }

    broadcast(ws, delta)
  })

  ws.on("close", () => {
    if (userId) {
      users.delete(userId)
      broadcast(ws, { type: "delta", action: "leave", userId })
    }
  })
})

function broadcast(sender, data) {
  wss.clients.forEach((client) => {
    if (client !== sender && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data))
    }
  })
}

console.log("WebSocket server running on ws://localhost:3001")

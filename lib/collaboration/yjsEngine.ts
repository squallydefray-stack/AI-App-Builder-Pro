// lib/collaboration/yjsEngine.ts
import * as Y from "yjs"
import { WebsocketProvider } from "y-websocket"

export function createCollaboration(roomId: string) {
  const doc = new Y.Doc()

  const provider = new WebsocketProvider(
    "ws://localhost:1234",
    roomId,
    doc
  )

  const yMap = doc.getMap("builder")

  return {
    doc,
    provider,
    yMap,
  }
}

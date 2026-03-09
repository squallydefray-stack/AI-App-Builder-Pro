import * as Y from "yjs"
import { WebsocketProvider } from "y-websocket"
import { Awareness } from "y-protocols/awareness"

export interface CollaborationInstance {
  ydoc: Y.Doc
  provider: WebsocketProvider
  yPages: Y.Array<any>
  awareness: Awareness
  destroy: () => void
}

export function initCollaboration(room: string): CollaborationInstance {
  // Create shared document
  const ydoc = new Y.Doc()

  // Connect to websocket server
  const provider = new WebsocketProvider(
    "wss://demos.yjs.dev", // Replace with your own in production
    room,
    ydoc,
    {
      connect: true,
    }
  )

  // Shared array for pages
  const yPages = ydoc.getArray<any>("pages")

  // Awareness (presence / cursors)
  const awareness = provider.awareness

  // Set local user state (optional, customize later)
  awareness.setLocalStateField("user", {
    name: "Anonymous",
    color: "#" + Math.floor(Math.random() * 16777215).toString(16),
  })

  // Optional: Connection logging
  provider.on("status", (event: { status: string }) => {
    // console.log("YJS connection status:", event.status)  // TODO: remove before release
  })

  // Clean destroy method (VERY important)
  const destroy = () => {
    provider.destroy()
    ydoc.destroy()
  }

  return {
    ydoc,
    provider,
    yPages,
    awareness,
    destroy,
  }
}

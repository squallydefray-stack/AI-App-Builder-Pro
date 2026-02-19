// lib/collaboration/collab.ts
import * as Y from "yjs"
import { WebsocketProvider } from "y-websocket"
import { useBuilderStore } from "@state/builderStore"

let provider: WebsocketProvider | null = null
let ydoc: Y.Doc | null = null

export function initCollaboration(roomId: string) {
  if (provider) return { provider, ydoc }

  ydoc = new Y.Doc()

  provider = new WebsocketProvider(
    "ws://localhost:1234",
    roomId,
    ydoc
  )

  const awareness = provider.awareness
  const store = useBuilderStore.getState()

  // Assign random color + name
  const user = {
    id: crypto.randomUUID(),
    name: "User " + Math.floor(Math.random() * 100),
    color: `hsl(${Math.random() * 360}, 80%, 60%)`,
  }

  awareness.setLocalStateField("user", user)

  // Track cursor movement
  window.addEventListener("mousemove", (e) => {
    awareness.setLocalStateField("cursor", {
      x: e.clientX,
      y: e.clientY,
    })
  })

  // Track selection
  store.subscribe(
    (s) => s.selectedIds,
    (selected) => {
      awareness.setLocalStateField("selection", selected)
    }
  )

  return { provider, ydoc }
}

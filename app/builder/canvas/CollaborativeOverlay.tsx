"use client"

import { useEffect, useState } from "react"
import { WebsocketProvider } from "y-websocket"

interface Props {
  provider: WebsocketProvider
}

export default function CollaborativeOverlay({ provider }: Props) {
  const [states, setStates] = useState<any[]>([])

  useEffect(() => {
    const awareness = provider.awareness

    const update = () => {
      const users = Array.from(awareness.getStates().values())
      setStates(users)
    }

    awareness.on("change", update)
    update()

    return () => {
      awareness.off("change", update)
    }
  }, [provider])

  return (
    <>
      {states.map((state: any, index) => {
        if (!state.cursor || !state.user) return null

        return (
          <div
            key={index}
            style={{
              position: "fixed",
              left: state.cursor.x,
              top: state.cursor.y,
              pointerEvents: "none",
              zIndex: 9999,
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                background: state.user.color,
                borderRadius: "50%",
              }}
            />
            <div
              style={{
                background: state.user.color,
                color: "white",
                padding: "2px 6px",
                fontSize: 12,
                borderRadius: 6,
                marginTop: 2,
              }}
            >
              {state.user.name}
            </div>
          </div>
        )
      })}
    </>
  )
}

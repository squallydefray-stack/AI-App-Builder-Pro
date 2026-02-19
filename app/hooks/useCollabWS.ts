"use client"

import { useEffect, useRef } from "react"
import { useBuilderStore } from "../state/builderStore"

export function useCollabWS() {
  const wsRef = useRef<WebSocket | null>(null)
  const setUserHighlight = useBuilderStore((s) => s.setUserHighlight)
  const removeUserHighlight = useBuilderStore((s) => s.removeUserHighlight)
  const setCursor = useBuilderStore((s) => s.setCursor)
  const removeCursor = useBuilderStore((s) => s.removeCursor)

  const userId = useRef(`User${Math.floor(Math.random() * 1000)}`).current
  const color = useRef(`hsl(${Math.floor(Math.random() * 360)},70%,50%)`).current

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3001")
    wsRef.current = ws

    ws.onopen = () => ws.send(JSON.stringify({ type: "join", userId, color }))

    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data)
      data.users.forEach((u: any) => {
        if (u.userId !== userId) {
          setUserHighlight(u.userId, u.highlights, u.color)
          setCursor(u.userId, u.x, u.y, u.color)
        }
      })
    }

    ws.onclose = () => {
      removeUserHighlight(userId)
      removeCursor(userId)
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (ws.readyState === WebSocket.OPEN)
        ws.send(JSON.stringify({ type: "cursor", userId, x: e.clientX, y: e.clientY }))
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      ws.close()
      window.removeEventListener("mousemove", handleMouseMove)
      removeUserHighlight(userId)
      removeCursor(userId)
    }
  }, [userId, color, setUserHighlight, removeUserHighlight, setCursor, removeCursor])

  const sendHighlight = (ids: string[]) => {
    if (wsRef.current?.readyState === WebSocket.OPEN)
      wsRef.current.send(JSON.stringify({ type: "highlight", userId, ids, color }))
  }

  return { userId, color, sendHighlight }
}

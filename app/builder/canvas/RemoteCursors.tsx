// app/builder/canvas/RemoteCursors.tsx
// AI-App-Builder-Pro
//
// Created by Squally Da Boss on 2/23/26.

"use client"

import React from "react"
import { BuilderComponent } from "@lib/exporter/schema"
import { useBuilderStore } from "@/builder/state/builderStore"

type Props = {
  components: BuilderComponent[]
  findNode: (components: BuilderComponent[], id: string) => BuilderComponent | null
}

export function RemoteCursors({ components, findNode }: Props) {
  const remoteSelections = useBuilderStore((s) => s.remoteSelections)
  const activeBreakpoint = useBuilderStore((s) => s.activeBreakpoint)

  return (
    <>
      {Object.entries(remoteSelections).map(([userId, { selectedIds, cursor }]) =>
        selectedIds.map((compId) => {
          const node = findNode(components, compId)
          if (!node) return null

          const props = node.propsPerBreakpoint?.[activeBreakpoint] || node.props || {}
          const x = props.x || 0
          const y = props.y || 0
          const width = props.width || 100
          const height = props.height || 50

          const color = hashColor(userId)

          return (
            <div
              key={`${userId}-${compId}`}
              style={{
                position: "absolute",
                left: x,
                top: y,
                width,
                height,
                border: `2px dashed ${color}`,
                borderRadius: 4,
                pointerEvents: "none",
                zIndex: 9999,
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: -18,
                  left: 0,
                  fontSize: 12,
                  fontWeight: "bold",
                  color,
                  backgroundColor: "rgba(255,255,255,0.8)",
                  padding: "0 2px",
                  borderRadius: 2,
                }}
              >
                {userId}
              </span>
            </div>
          )
        })
      )}

      {/* Optional: render remote cursors for users */}
      {Object.entries(remoteSelections).map(([userId, { cursor }]) =>
        cursor ? (
          <div
            key={`cursor-${userId}`}
            style={{
              position: "absolute",
              left: cursor.x,
              top: cursor.y,
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: hashColor(userId),
              pointerEvents: "none",
              zIndex: 10000,
            }}
          />
        ) : null
      )}
    </>
  )
}

// Utility: generate consistent color per userId
function hashColor(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  const c = (hash & 0x00ffffff).toString(16).toUpperCase()
  return `#${"00000".substring(0, 6 - c.length)}${c}`
}

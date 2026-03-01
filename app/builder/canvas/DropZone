// app/builder/components/DropZone.tsx
"use client"

import React, { createContext, useContext } from "react"
import { BuilderComponent } from "@lib/exporter/schema"

interface CanvasDropContextProps {
  onDragMove?: (event: any) => void
  onDragEnd?: (event: any) => void
}

const CanvasDropContext = createContext<CanvasDropContextProps>({})

export const useCanvasDropContext = () => useContext(CanvasDropContext)

export const CanvasDropProvider: React.FC<CanvasDropContextProps & { children: React.ReactNode }> = ({
  children,
  onDragMove,
  onDragEnd,
}) => {
  return (
    <CanvasDropContext.Provider value={{ onDragMove, onDragEnd }}>
      {children}
    </CanvasDropContext.Provider>
  )
}

/** =========================
 * DropZone — wraps each component for drag/drop
 ========================== */
interface DropZoneProps {
  id: string
  x: number
  y: number
  width: number
  height: number
  children: React.ReactNode
}

export const DropZone: React.FC<DropZoneProps> = ({ id, x, y, width, height, children }) => {
  const { onDragMove, onDragEnd } = useCanvasDropContext()

  return (
    <div
      data-drop-id={id}
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
      }}
      onDrag={(e) => onDragMove?.(e)}
      onDragEnd={(e) => onDragEnd?.(e)}
    >
      {children}
    </div>
  )
}

export { CanvasDropContext, CanvasDropProvider }

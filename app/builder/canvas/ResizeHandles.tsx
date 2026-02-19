// app/builder/canvas/ResizeHandles.tsx

"use client"

import React from "react"
import { motion } from "framer-motion"

interface ResizeHandlesProps {
  targetRef: React.RefObject<HTMLDivElement>
  onResize: (width: number, height: number) => void
  parentWidth?: number
  parentHeight?: number
  autoLayout?: any
}

const ResizeHandles: React.FC<ResizeHandlesProps> = ({ targetRef, onResize, parentWidth, parentHeight, autoLayout }) => {

  const handleDrag = (e: MouseEvent, direction: "right" | "bottom" | "corner") => {
    if (!targetRef.current) return
    const rect = targetRef.current.getBoundingClientRect()
    let newWidth = rect.width
    let newHeight = rect.height

    if (direction === "right" || direction === "corner") {
      newWidth = Math.min(parentWidth || Infinity, e.clientX - rect.left)
    }
    if (direction === "bottom" || direction === "corner") {
      newHeight = Math.min(parentHeight || Infinity, e.clientY - rect.top)
    }

    // Respect AutoLayout
    if (autoLayout?.enabled && autoLayout.direction === "row") newHeight = rect.height
    if (autoLayout?.enabled && autoLayout.direction === "column") newWidth = rect.width

    onResize(newWidth, newHeight)
  }

  const createHandle = (direction: "right" | "bottom" | "corner") => (
    <motion.div
      className={`absolute ${
        direction === "right" ? "right-0 top-1/2 -translate-y-1/2 cursor-ew-resize" :
        direction === "bottom" ? "bottom-0 left-1/2 -translate-x-1/2 cursor-ns-resize" :
        "right-0 bottom-0 cursor-se-resize"
      } w-3 h-3 bg-blue-500 rounded z-50`}
      drag
      dragConstraints={{ top: 0, left: 0, right: parentWidth || 500, bottom: parentHeight || 500 }}
      onDrag={(e, info) => handleDrag({ clientX: info.point.x, clientY: info.point.y } as any, direction)}
    />
  )

  return (
    <>
      {createHandle("right")}
      {createHandle("bottom")}
      {createHandle("corner")}
    </>
  )
}

export default ResizeHandles

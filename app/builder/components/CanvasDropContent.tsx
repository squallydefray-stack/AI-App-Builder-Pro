// app/builder/canvas/CanvasDropContent.tsx
"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BuilderComponent } from "@lib/exporter/schema"

interface CanvasDropContentProps {
  x: number
  y: number
  width: number
  height: number
  children?: React.ReactNode
  isPlaceholder?: boolean
}

/**
 * Renders a container drop highlight / placeholder
 * for animated preview when dragging components.
 */
const CanvasDropContent: React.FC<CanvasDropContentProps> = ({
  x,
  y,
  width,
  height,
  children,
  isPlaceholder = false,
}) => {
  return (
    <div
      className="absolute"
      style={{ top: y, left: x, width, height }}
    >
      <AnimatePresence>
        {isPlaceholder && (
          <motion.div
            className="absolute border-2 border-dashed border-blue-500 rounded-lg pointer-events-none bg-blue-100/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, scale: 1.02 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            style={{ width, height }}
          />
        )}
      </AnimatePresence>

      {children}
    </div>
  )
}

export default CanvasDropContent

// app/builder/components/DropZone.tsx
"use client"

import React, { useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BuilderComponent } from "@lib/exporter/schema"
import { useBuilderStore } from "@/state/builderStore"

interface DropZoneProps {
  id: string
  x?: number
  y?: number
  width?: number
  height?: number
  children?: React.ReactNode
}

export const DropZone: React.FC<DropZoneProps> = ({ id, x = 0, y = 0, width = 100, height = 100, children }) => {
  const { selectedIds, setSelection } = useBuilderStore()
  const [hovered, setHovered] = useState(false)

  const isSelected = selectedIds.includes(id)

  return (
    <div
      data-builder-id={id}
      className="absolute"
      style={{ top: y, left: x, width, height }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation()
        setSelection([id])
      }}
    >
      {/* Optional highlight for selected / hover */}
      <AnimatePresence>
        {(hovered || isSelected) && (
          <motion.div
            className="absolute border-2 border-dashed border-blue-400 pointer-events-none rounded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ width, height }}
          />
        )}
      </AnimatePresence>

      {children}
    </div>
  )
}

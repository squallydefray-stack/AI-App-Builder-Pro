// app/builder/canvas/ResizerOverlay.tsx
"use client"
import React, { useState } from "react"
import { useBuilderStore } from "../state/builderStore"

interface Props {
  selectedIds: string[]
  snapGrid?: number
  lockAspectRatio?: boolean
}

export const ResizerOverlay: React.FC<Props> = ({ selectedIds, snapGrid = 1, lockAspectRatio = false }) => {
  const pages = useBuilderStore(s => s.pages)
  const activePageId = useBuilderStore(s => s.activePageId)
  const updateMultipleComponents = useBuilderStore(s => s.updateMultipleComponents)
  const [dragging, setDragging] = useState(false)

  const page = pages.find(p => p.id === activePageId)
  if (!page || !selectedIds.length) return null

  const comps = page.components.filter(c => selectedIds.includes(c.id))
  let minX = Math.min(...comps.map(c => c.layout?.x || 0))
  let minY = Math.min(...comps.map(c => c.layout?.y || 0))
  let maxX = Math.max(...comps.map(c => (c.layout?.x||0) + (c.layout?.width||0)))
  let maxY = Math.max(...comps.map(c => (c.layout?.y||0) + (c.layout?.height||0)))
  const width = maxX - minX
  const height = maxY - minY

  const snap = (value: number) => Math.round(value / snapGrid) * snapGrid

  const handleDrag = (dx: number, dy: number) => {
    const updated = page.components.map(c => {
      if (!selectedIds.includes(c.id)) return c
      const layout = { ...c.layout }
      layout.x = snap((layout.x||0) + dx)
      layout.y = snap((layout.y||0) + dy)
      return { ...c, layout }
    })
    updateMultipleComponents(updated)
  }

  return (
    <div
      style={{ position:"absolute", top:minY, left:minX, width, height, border:"2px dashed #3b82f6", cursor:"move", pointerEvents:"auto" }}
      onMouseDown={e=>{
        e.preventDefault()
        const startX = e.clientX
        const startY = e.clientY
        setDragging(true)
        const onMouseMove = (ev: MouseEvent) => handleDrag(ev.clientX - startX, ev.clientY - startY)
        const onMouseUp = () => { setDragging(false); window.removeEventListener("mousemove", onMouseMove); window.removeEventListener("mouseup", onMouseUp) }
        window.addEventListener("mousemove", onMouseMove)
        window.addEventListener("mouseup", onMouseUp)
      }}
    />
  )
}

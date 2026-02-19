//
//  MultiSelectOverlay.tsx
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/17/26.
//


"use client"

import { useEffect, useState } from "react"
import { useBuilderStore } from "@builder/state/builderStore"

export default function MultiSelectOverlay() {
  const selectedIds = useBuilderStore(s => s.selectedIds)
  const [bounds, setBounds] = useState<DOMRect | null>(null)

  useEffect(() => {
    if (selectedIds.length < 2) {
      setBounds(null)
      return
    }

    const rects = selectedIds
      .map(id => document.getElementById(id))
      .filter(Boolean)
      .map(el => el!.getBoundingClientRect())

    if (!rects.length) return

    const left = Math.min(...rects.map(r => r.left))
    const top = Math.min(...rects.map(r => r.top))
    const right = Math.max(...rects.map(r => r.right))
    const bottom = Math.max(...rects.map(r => r.bottom))

    setBounds(
      new DOMRect(left, top, right - left, bottom - top)
    )
  }, [selectedIds])

  if (!bounds) return null

  return (
    <div
      className="absolute border-2 border-blue-500 pointer-events-none"
      style={{
        left: bounds.left,
        top: bounds.top,
        width: bounds.width,
        height: bounds.height,
      }}
    />
          <MultiSelectOverlay />
  )
}

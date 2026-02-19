//
//  DropIndicator.tsx
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/12/26.
//


"use client"
import React from "react"

type Props = { depth?: number; isActive?: boolean }

export default function DropIndicator({ depth = 0, isActive = false }: Props) {
  return (
    <div
      className={`h-1 my-1 rounded transition-all ${isActive ? "bg-blue-500" : "bg-gray-300"}`}
      style={{ marginLeft: depth * 16 }}
    />
  )
}

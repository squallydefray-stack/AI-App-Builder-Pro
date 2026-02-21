"use client"

import React from "react"
import { BuilderCanvas } from "@canvas/Canvas"
import { useBuilderStore } from "@state/builderStore"

export default function BuilderPage() {
  const { pages, activePageId } = useBuilderStore()

  return (
    <div className="h-screen w-screen bg-gray-50 p-4">
      <BuilderCanvas builderSchema={{ pages }} />
    </div>
  )
}
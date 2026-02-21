"use client"

import React, { useState } from "react"
import { BuilderCanvas } from "@builder/canvas/Canvas"
import { useBuilderStore } from "@state/builderStore"
import { BuilderSchema } from "@lib/exporter/schema"

type BuilderPageProps = {
  builderSchema: BuilderSchema
}

export default function BuilderPage({ builderSchema }: BuilderPageProps) {
  const { pages, activePageId } = useBuilderStore()
  const activePages = builderSchema?.pages || pages
  const activePage = activePages.find((p) => p.id === activePageId) || activePages[0]

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Canvas takes full center */}
      <main className="flex-1 relative overflow-auto bg-gray-100">
        <BuilderCanvas builderSchema={builderSchema} />
      </main>
    </div>
  )
}

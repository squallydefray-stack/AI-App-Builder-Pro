//
//  FullAppPreview.tsx
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/17/26.
//


"use client"

import React, { useState } from "react"
import { useBuilderStore } from "@/state/builderStore"
import { BuilderPage, BuilderComponent } from "@lib/exporter/schema"

interface FullAppPreviewProps {
  onClose: () => void
}

export default function FullAppPreview({ onClose }: FullAppPreviewProps) {
  const { pages, activePageId, switchPage } = useBuilderStore()
  const [currentPageId, setCurrentPageId] = useState(activePageId || pages[0]?.id)

  const page = pages.find((p) => p.id === currentPageId)

  if (!page) return null

  /** =========================
   * Recursive Node Renderer
   ========================== */
  const renderNode = (node: BuilderComponent) => {
    const style: React.CSSProperties = {
      position: "absolute",
      top: node.props.base?.top || 0,
      left: node.props.base?.left || 0,
      width: node.props.base?.width || 100,
      height: node.props.base?.height || 50,
      backgroundColor: node.props.base?.backgroundColor || "#eee",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      border: "1px solid #ccc",
      borderRadius: "4px",
      fontSize: "12px",
      overflow: "hidden",
      cursor: "pointer",
    }

    return (
      <div key={node.id} style={style}>
        {node.props.base?.text || node.type}
        {node.children?.map((child) => renderNode(child))}
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center p-6">
      <div className="bg-white rounded shadow-xl w-full max-w-5xl h-full max-h-[90vh] relative flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b bg-gray-100">
          <h2 className="font-bold text-lg">{page.name} — Preview</h2>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition"
          >
            Close
          </button>
        </div>

        {/* Navigation */}
        <div className="flex gap-2 p-2 border-b bg-gray-50 overflow-x-auto">
          {pages.map((p) => (
            <button
              key={p.id}
              onClick={() => setCurrentPageId(p.id)}
              className={`px-3 py-1 rounded text-sm ${
                p.id === currentPageId ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>

        {/* Page Canvas */}
        <div className="flex-1 relative bg-gray-100 overflow-auto p-4">
          {page.components.map((node) => renderNode(node))}
        </div>
      </div>
    </div>
  )
}

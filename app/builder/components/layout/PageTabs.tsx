// app/builder/components/layout/PageTabs.tsx
"use client"

import React, { useState } from "react"
import { useBuilderStore } from "@/builder/state/builderStore"

export default function PageTabs() {
  const pages = useBuilderStore((s) => s.pages)
  const activePageId = useBuilderStore((s) => s.activePageId)
  const setActivePage = useBuilderStore((s) => s.setActivePage)
  const addPage = useBuilderStore((s) => s.addPage)
  const renamePage = useBuilderStore((s) => s.renamePage)
  const deletePage = useBuilderStore((s) => s.deletePage)
  const duplicatePage = useBuilderStore((s) => s.duplicatePage)

  const [editingPageId, setEditingPageId] = useState<string | null>(null)
  const [inputValue, setInputValue] = useState("")

  const startEditing = (pageId: string, name: string) => {
    setEditingPageId(pageId)
    setInputValue(name)
  }

  const finishEditing = () => {
    if (editingPageId) {
      renamePage(editingPageId, inputValue)
      setEditingPageId(null)
    }
  }

  return (
    <div className="flex items-center gap-2 bg-gray-100 p-2">
      {pages.map((page) => (
        <div key={page.id} className="flex items-center gap-1">
          {editingPageId === page.id ? (
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onBlur={finishEditing}
              onKeyDown={(e) => {
                if (e.key === "Enter") finishEditing()
              }}
              className="px-2 py-1 border rounded text-sm font-semibold"
              autoFocus
            />
          ) : (
            <button
              onClick={() => setActivePage(page.id)}
              onDoubleClick={() => startEditing(page.id, page.name)}
              className={`px-3 py-1 rounded ${
                page.id === activePageId
                  ? "bg-blue-600 text-white font-semibold"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {page.name}
            </button>
          )}

          {/* Duplicate */}
          <button
            onClick={() => duplicatePage(page.id)}
            className="text-xs px-1 bg-gray-300 rounded"
            title="Duplicate Page"
          >
            ⧉
          </button>

          {/* Delete */}
          {pages.length > 1 && (
            <button
              onClick={() => deletePage(page.id)}
              className="text-xs px-1 bg-red-500 text-white rounded"
              title="Delete Page"
            >
              ✕
            </button>
          )}
        </div>
      ))}

      <button
        onClick={() => {
          const name = prompt("Page name") || `Page ${pages.length + 1}`
          addPage(name)
        }}
        className="px-3 py-1 bg-green-500 text-white rounded font-semibold"
      >
        + Add Page
      </button>
    </div>
  )
}

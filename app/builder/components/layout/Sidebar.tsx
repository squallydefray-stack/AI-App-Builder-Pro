// app/builder/components/layout/Sidebar.tsx
"use client"

import React, { useState } from "react"
import { useBuilderStore, BuilderPage } from "@state/builderStore"

export default function Sidebar() {
  const pages = useBuilderStore((s) => s.pages)
  const activePageId = useBuilderStore((s) => s.activePageId)
  const setActivePage = useBuilderStore((s) => s.setActivePage)
  const addPage = useBuilderStore((s) => s.addPage)
  const [newPageName, setNewPageName] = useState("")

  const handleAddPage = () => {
    if (newPageName.trim() === "") return
    addPage(newPageName.trim())
    setNewPageName("")
  }

  const handleSelectPage = (id: string) => {
    setActivePage(id)
  }

  return (
    <div className="w-64 h-full bg-gray-100 p-4 flex flex-col">
      <h2 className="text-lg font-bold mb-4">Pages</h2>

      {/* Page List */}
      <div className="flex-1 overflow-auto space-y-2">
        {pages.map((page: BuilderPage) => (
          <button
            key={page.id}
            onClick={() => handleSelectPage(page.id)}
            className={`w-full text-left px-2 py-1 rounded ${
              page.id === activePageId ? "bg-blue-500 text-white" : "hover:bg-gray-200"
            }`}
          >
            {page.name}
          </button>
        ))}
      </div>

      {/* Add New Page */}
      <div className="mt-4">
        <input
          type="text"
          placeholder="New Page Name"
          value={newPageName}
          onChange={(e) => setNewPageName(e.target.value)}
          className="w-full px-2 py-1 border rounded mb-2"
        />
        <button
          onClick={handleAddPage}
          className="w-full px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Add Page
        </button>
      </div>
    </div>
  )
}

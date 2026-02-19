//
//  PageTreePage.tsx
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/17/26.
//


// app/builder/pages/PageTreePage.tsx
"use client"

import React from "react"
import Canvas from "../canvas/Canvas"
import InspectorPanel from "../components/InspectorPanel"
import { useBuilderStore } from "../state/builderStore"

export default function PageTreePage() {
  const { pages, activePageId, setSchema, undo, redo } = useBuilderStore()

  const addPage = () => {
    const newPageId = `page-${Date.now()}`
    const newPages = [...pages, { id: newPageId, name: "New Page", route: "/", components: [] }]
    setSchema({ pages: newPages })
  }

  const removePage = (id: string) => {
    const filtered = pages.filter((p) => p.id !== id)
    setSchema({ pages: filtered })
  }

  return (
    <div className="flex h-screen w-full bg-gray-100 overflow-hidden">
      {/* LEFT — Page Tree Sidebar */}
      <div className="w-64 border-r bg-white flex flex-col overflow-auto">
        <div className="px-4 py-2 border-b flex justify-between items-center">
          <span className="font-bold">Pages</span>
          <button onClick={addPage} className="px-2 py-1 bg-gray-200 rounded">+ Add</button>
        </div>
        {pages.map((p) => (
          <div key={p.id} className={`px-4 py-2 cursor-pointer flex justify-between items-center ${p.id === activePageId ? "bg-gray-200" : ""}`}>
            <span>{p.name}</span>
            <button onClick={() => removePage(p.id)} className="px-2 py-1 bg-red-200 rounded text-xs">x</button>
          </div>
        ))}
      </div>

      {/* CENTER — Canvas */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-2 px-4 py-2 border-b bg-white">
          <button onClick={undo} className="px-3 py-1 border rounded">Undo</button>
          <button onClick={redo} className="px-3 py-1 border rounded">Redo</button>
        </div>
        <div className="flex-1 overflow-auto flex justify-center p-4">
          <div className="bg-white min-h-[1000px] w-full shadow-xl">
            <Canvas />
          </div>
        </div>
      </div>

      {/* RIGHT — Inspector */}
      <div className="w-80 border-l bg-white overflow-auto">
        <InspectorPanel />
      </div>
    </div>
  )
}

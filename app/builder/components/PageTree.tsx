"use client"

"use client"

import React from "react"
import { useBuilderStore } from "../state/builderStore"
import { BuilderPage } from "@lib/exporter/schema"
import { v4 as uuidv4 } from "uuid"

export default function PageTree() {
  const { pages, activePageId, switchPage, setSchema } = useBuilderStore()

  const handleAddPage = () => {
    const newPage: BuilderPage = {
      id: uuidv4(),
      name: `Page ${pages.length + 1}`,
      route: `/page-${pages.length + 1}`,
      components: [],
    }
    setSchema({ pages: [...pages, newPage] })
    switchPage(newPage.id)
  }

  const handleDeletePage = (id: string) => {
    const filtered = pages.filter((p) => p.id !== id)
    setSchema({ pages: filtered })
    if (activePageId === id && filtered.length > 0) switchPage(filtered[0].id)
  }

  const handleDuplicatePage = (page: BuilderPage) => {
    const copy: BuilderPage = {
      ...page,
      id: uuidv4(),
      name: `${page.name} Copy`,
      route: `${page.route}-copy`,
      components: page.components.map((c) => ({ ...c, id: uuidv4() })),
    }
    setSchema({ pages: [...pages, copy] })
    switchPage(copy.id)
  }

  return (
    <div className="p-2 flex flex-col gap-1">
      <button
        onClick={handleAddPage}
        className="w-full py-1 px-2 bg-blue-500 text-white rounded hover:bg-blue-600 mb-2"
      >
        + Add Page
      </button>

      {pages.map((page) => (
        <div
          key={page.id}
          className={`flex justify-between items-center px-2 py-1 rounded cursor-pointer ${
            activePageId === page.id ? "bg-blue-100 font-bold" : "hover:bg-gray-100"
          }`}
          onClick={() => switchPage(page.id)}
        >
          <span>{page.name}</span>
          <div className="flex gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleDuplicatePage(page)
              }}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              ⎘
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleDeletePage(page.id)
              }}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

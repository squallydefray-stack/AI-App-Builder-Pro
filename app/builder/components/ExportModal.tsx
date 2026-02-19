"use client"

import { useState } from "react"
import { useBuilderStore } from "@/app/builder/state/builderStore"
import { exportToZip } from "./exportToZip"
import { generateAppFiles } from "@/lib/exporter/generateAppFiles"
import { useBuilderStore } from "@/app/builder/state/builderStore"

// Inside ExportModal component:
<button
  onClick={async () => {
    setLoading(true)
    setMessage(null)
    try {
      const files = generateAppFiles({ pages }) // current schema
      await exportToZip(files, `${repoName || "ai-builder"}.zip`)
      setMessage("ZIP download ready!")
    } catch (err: any) {
      setMessage(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }}
  disabled={loading}
  className="px-3 py-2 bg-purple-600 text-white rounded-md"
>
  {loading ? "Generating ZIP..." : "Download ZIP"}
</button>

type ExportModalProps = {
  isOpen: boolean
  onClose: () => void
}

export default function ExportModal({ isOpen, onClose }: ExportModalProps) {
  const pages = useBuilderStore((s) => s.pages)
  const [repoName, setRepoName] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  if (!isOpen) return null

  const handleExport = async () => {
    if (!repoName.trim()) {
      setMessage("Repo name is required")
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const res = await fetch("/api/export/github", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoName, pages }),
      })
      const data = await res.json()
      if (res.ok) {
        setMessage(`Export successful! Repo URL: ${data.url}`)
      } else {
        setMessage(`Error: ${data.error}`)
      }
    } catch (err: any) {
      setMessage(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }
// 1️⃣ GitHub export
await fetch("/api/export/github", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ pages, repoName }),
})

// 2️⃣ ZIP download export
const files = generateAppFiles({ pages })
await exportToZip(files, `${repoName || "ai-builder"}.zip`)

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center jus
<div className="flex justify-end gap-2 mt-4">
  <button onClick={onClose} className="px-3 py-2 rounded-md border">
    Cancel
  </button>
  <button onClick={handleExport} disabled={loading} className="px-3 py-2 bg-blue-600 text-white rounded-md">
    {loading ? "Exporting..." : "Export to GitHub"}
  </button>
  <button
    onClick={async () => { /* ZIP code */ }}
    disabled={loading}
    className="px-3 py-2 bg-purple-600 text-white rounded-md"
  >
    {loading ? "Generating ZIP..." : "Download ZIP"}
  </button>
</div>

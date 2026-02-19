// app/builder/components/OneClickExport.tsx//  OneClickExport.tsx
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/13/26.
//



"use client"
import React, { useState } from "react"
import { useBuilderStore } from "../state/builderStore"
import { generateAppFiles } from "@/lib/exporter/generateAppFiles"
import { createZipFromFiles } from "@/lib/exporter/browserZipHelper"

export default function OneClickExport() {
  const pages = useBuilderStore((state) => state.pages)
  const [logs, setLogs] = useState<string[]>([])
  const [githubUrl, setGithubUrl] = useState<string | null>(null)

  const log = (msg: string) => setLogs((l) => [...l, msg])

  const handleExport = async () => {
    try {
      log("Generating project files...")
      const files = await generateAppFiles({ pages })

      // --- 1️⃣ Create ZIP for download ---
      log("Creating ZIP...")
      const zipBlob = await createZipFromFiles(files)
      const a = document.createElement("a")
      a.href = URL.createObjectURL(zipBlob)
      a.download = "ai-builder.zip"
      a.click()
      log("ZIP download ready!")

      // --- 2️⃣ Push to GitHub ---
      log("Sending files to GitHub...")
      const res = await fetch("/api/export/github-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files }),
      })
      const data = await res.json()
      if (data.url) {
        setGithubUrl(data.url)
        log(`GitHub repo created: ${data.url}`)
      } else {
        log("GitHub push failed.")
      }

      log("Export complete ✅")
    } catch (err: any) {
      log("Error: " + err.message)
    }
  }

  return (
    <div>
      <button
        onClick={handleExport}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Export Project
      </button>

      <div className="mt-4 bg-gray-100 p-2 h-48 overflow-y-auto text-sm">
        {logs.map((msg, i) => (
          <div key={i}>{msg}</div>
        ))}
      </div>

      {githubUrl && (
        <div className="mt-2 text-green-700">
          GitHub Repository:{" "}
          <a href={githubUrl} target="_blank" className="underline">
            {githubUrl}
          </a>
        </div>
      )}
    </div>
  )
}

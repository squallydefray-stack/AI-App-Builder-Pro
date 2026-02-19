//
//  RuntimeExportPreview.tsx
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/17/26.
//


"use client"

import React, { useState, useEffect, useRef } from "react"
import { useBuilderStore } from "../state/builderStore"
import { convertToNextTailwind, convertToReactNative } from "@/lib/exporter/codeGenerator"
import ExportFeedbackPanel from "./ExportFeedbackPanel"

export default function RuntimeExportPreview() {
  const { pages, zoom } = useBuilderStore()
  const [platform, setPlatform] = useState<"nextjs" | "reactnative">("nextjs")
  const [liveCode, setLiveCode] = useState<string>("")
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // -------------------------
  // Generate live export code per platform
  // -------------------------
  useEffect(() => {
    const code =
      platform === "nextjs"
        ? convertToNextTailwind({ pages })
        : convertToReactNative({ pages })
    setLiveCode(code)
  }, [pages, platform])

  // -------------------------
  // Write live code into iframe
  // -------------------------
  useEffect(() => {
    if (!iframeRef.current) return
    const doc = iframeRef.current.contentDocument
    if (!doc) return
    doc.open()
    // For RN web simulation, wrap with div + RN web styles
    if (platform === "reactnative") {
      doc.write(`
        <html>
          <head>
            <meta charset="UTF-8" />
            <title>RN Preview</title>
            <style>
              body { margin:0; font-family:sans-serif; }
              #root { width:100%; height:100%; display:flex; flex-direction:column; }
            </style>
          </head>
          <body>
            <div id="root"></div>
            <script type="module">
              ${liveCode}
            </script>
          </body>
        </html>
      `)
    } else {
      doc.write(`
        <html>
          <head>
            <meta charset="UTF-8" />
            <title>Next.js Preview</title>
            <script src="https://cdn.tailwindcss.com"></script>
          </head>
          <body class="p-4">
            ${liveCode}
          </body>
        </html>
      `)
    }
    doc.close()
  }, [liveCode, platform])

  return (
    <div className="flex flex-col w-full h-full gap-2">
      {/* Platform Toggle */}
      <div className="flex gap-2">
        <button
          className={`px-3 py-1 rounded ${platform === "nextjs" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setPlatform("nextjs")}
        >
          Next.js / Tailwind
        </button>
        <button
          className={`px-3 py-1 rounded ${platform === "reactnative" ? "bg-green-500 text-white" : "bg-gray-200"}`}
          onClick={() => setPlatform("reactnative")}
        >
          React Native
        </button>
      </div>

      {/* Live Runtime Preview */}
      <div className="flex-1 border rounded-lg overflow-hidden" style={{ transform: `scale(${zoom})`, transformOrigin: "top left"` }}>
        <iframe
          ref={iframeRef}
          title="Runtime Preview"
          className="w-full h-full border-none"
        />
      </div>

      {/* Export Feedback Panel */}
      <ExportFeedbackPanel liveCode={liveCode} />
    </div>
  )
}

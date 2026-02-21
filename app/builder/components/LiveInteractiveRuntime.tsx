//
//  LiveInteractiveRuntime.tsx
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/17/26.
//


"use client"

import React, { useRef, useState, useEffect, useCallback } from "react"
import { useBuilderStore } from ".@/state/builderStore"
import { BuilderComponent, BuilderSchema } from "@lib/exporter/schema"
import { convertToNextTailwind, convertToReactNative } from "@/lib/exporter/codeGenerator"
import { reflowAutoLayout } from "@/lib/utils/autoLayoutEngine"
import ExportFeedbackPanel from "./ExportFeedbackPanel"

interface LiveInteractiveRuntimeProps {
  zoom?: number
}

export default function LiveInteractiveRuntime({ zoom = 1 }: LiveInteractiveRuntimeProps) {
  const { pages } = useBuilderStore()
  const page = pages[0]
  const [platform, setPlatform] = useState<"nextjs" | "reactnative">("nextjs")
  const [liveCode, setLiveCode] = useState<string>("")
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // -------------------------
  // Generate live export code
  // -------------------------
  const generateLiveCode = useCallback(() => {
    const code =
      platform === "nextjs"
        ? convertToNextTailwind({ pages } as BuilderSchema)
        : convertToReactNative({ pages } as BuilderSchema)
    setLiveCode(code)
  }, [pages, platform])

  useEffect(() => {
    generateLiveCode()
  }, [generateLiveCode])

  // -------------------------
  // Write code to iframe live
  // -------------------------
  const writeIframe = useCallback(() => {
    if (!iframeRef.current) return
    const doc = iframeRef.current.contentDocument
    if (!doc) return
    doc.open()
    if (platform === "reactnative") {
      doc.write(`
        <html>
          <head>
            <meta charset="UTF-8" />
            <title>RN Runtime</title>
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
            <title>Next.js Runtime</title>
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

  useEffect(() => {
    writeIframe()
  }, [writeIframe])

  // -------------------------
  // Subscribe to builder changes for live WYSIWYG updates
  // -------------------------
  const { pages: builderPages } = useBuilderStore()
  useEffect(() => {
    // Reflow AutoLayout dynamically on builder changes
    const updatedComponents = reflowAutoLayout([...builderPages[0].components], 1440, 900)
    builderPages[0].components = updatedComponents
    generateLiveCode()
  }, [builderPages, generateLiveCode])

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

      {/* Live Interactive Runtime Iframe */}
      <div className="flex-1 border rounded-lg overflow-hidden relative" style={{ transform: `scale(${zoom})`, transformOrigin: "top left"` }}>
        <iframe
          ref={iframeRef}
          title="Live Interactive Runtime"
          className="w-full h-full border-none"
        />
      </div>

      {/* Live Export Code Panel */}
      <ExportFeedbackPanel liveCode={liveCode} />
    </div>
  )
}

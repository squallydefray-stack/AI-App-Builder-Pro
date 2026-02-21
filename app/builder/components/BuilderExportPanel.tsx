//
//  BuilderExportPanel.tsx
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/17/26.
//

"use client"

import React, { useState, useEffect } from "react"
import { useBuilderStore } from "@/state/builderStore"
import NodeRenderer from "./NodeRenderer"
import { BuilderComponent } from "@lib/exporter/schema"
import { motion, AnimatePresence } from "framer-motion"
import { generateExportCode, pushToGitHub } from "@lib/exporter/exporter"

interface BuilderExportPanelProps {
  onClose: () => void
}

interface GitHubStatus {
  phase: "idle" | "preparing" | "committing" | "pushing" | "success" | "error"
  message?: string
}

const BuilderExportPanel: React.FC<BuilderExportPanelProps> = ({ onClose }) => {
  const { pages, activePageId } = useBuilderStore()
  const page = pages.find(p => p.id === activePageId)

  const [exportCode, setExportCode] = useState<string | null>(null)
  const [ghStatus, setGhStatus] = useState<GitHubStatus>({ phase: "idle" })
  const [simulatedComponents, setSimulatedComponents] = useState<BuilderComponent[]>([])

  // Prepare a live simulation of AutoLayout + Repeaters
  useEffect(() => {
    if (!page) return
    // Deep clone to avoid mutating store
    const cloned = JSON.parse(JSON.stringify(page.components))
    // Here we could simulate repeaters / data-bound components
    const simulate = (nodes: BuilderComponent[]): BuilderComponent[] =>
      nodes.flatMap(n => {
        if (n.type === "Repeater" && n.props.data && Array.isArray(n.props.data)) {
          return n.props.data.map((item: any, idx: number) => ({
            ...n.children[0], // assume first child is template
            id: `${n.id}-${idx}`,
            props: {
              ...n.children[0].props,
              base: { ...n.children[0].props.base, ...item }
            }
          }))
        }
        if (n.children) n.children = simulate(n.children)
        return n
      })
    setSimulatedComponents(simulate(cloned))
  }, [page])

  const handleGenerateExport = async () => {
    if (!page) return
    try {
      setExportCode("Generating...")
      const code = await generateExportCode(page)
      setExportCode(code)
    } catch (err) {
      console.error(err)
      setExportCode("// Failed to generate export code")
    }
  }

  const handlePushGitHub = async () => {
    if (!exportCode) return
    setGhStatus({ phase: "preparing", message: "Preparing files..." })
    try {
      setGhStatus({ phase: "committing", message: "Committing code..." })
      await pushToGitHub(exportCode)
      setGhStatus({ phase: "success", message: "Pushed to GitHub successfully!" })
    } catch (err) {
      console.error(err)
      setGhStatus({ phase: "error", message: "GitHub push failed" })
    }
  }

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="absolute top-0 right-0 w-96 h-full bg-gray-50 border-l border-gray-200 shadow-lg flex flex-col z-50"
    >
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-2 border-b bg-white">
        <h2 className="font-semibold text-lg">Export & Preview</h2>
        <button onClick={onClose} className="text-gray-600 hover:text-gray-900">✕</button>
      </div>

      {/* Live Simulation */}
      <div className="flex-1 overflow-auto p-2 bg-white">
        <div className="relative bg-gray-100 p-2 rounded min-h-[300px] flex flex-col gap-2">
          <AnimatePresence>
            {simulatedComponents.map(c => (
              <NodeRenderer key={c.id} component={c} />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Export Controls */}
      <div className="px-4 py-2 border-t flex flex-col gap-2 bg-gray-50">
        <button
          onClick={handleGenerateExport}
          className="px-3 py-2 bg-black text-white rounded hover:opacity-90 transition"
        >
          Generate Export Code
        </button>

        {exportCode && (
          <textarea
            readOnly
            value={exportCode}
            className="w-full h-40 mt-2 p-2 border rounded bg-gray-100 font-mono text-xs overflow-auto"
          />
        )}

        <button
          onClick={handlePushGitHub}
          disabled={!exportCode || ghStatus.phase === "pushing"}
          className="px-3 py-2 bg-blue-600 text-white rounded hover:opacity-90 transition mt-2"
        >
          Push to GitHub
        </button>

        {/* GitHub Status */}
        {ghStatus.phase !== "idle" && (
          <div className="mt-1 text-sm">
            <span
              className={`${
                ghStatus.phase === "success"
                  ? "text-green-600"
                  : ghStatus.phase === "error"
                  ? "text-red-600"
                  : "text-gray-700"
              }`}
            >
              {ghStatus.message}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default BuilderExportPanel

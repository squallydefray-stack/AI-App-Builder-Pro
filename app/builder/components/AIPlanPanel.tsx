// app/builder/components/AIPlanPanel.tsx
"use client"

import React from "react"

interface AIPlanPanelProps {
  plan: any | null
  onGenerate: () => void
  onCancel: () => void
}

export default function AIPlanPanel({ plan, onGenerate, onCancel }: AIPlanPanelProps) {
  if (!plan) return null

  return (
    <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-lg border-l z-50 flex flex-col">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="text-lg font-semibold">AI Plan</h3>
        <button onClick={onCancel} className="text-gray-500 hover:text-black">✕</button>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-2">
        {plan.steps?.map((step: any, idx: number) => (
          <div key={idx} className="p-2 border rounded bg-gray-50">
            <p className="text-sm">{step.description || step.action}</p>
          </div>
        ))}
      </div>

      <div className="p-4 border-t flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="px-3 py-1 border rounded hover:bg-gray-100 transition"
        >
          Cancel
        </button>
        <button
          onClick={onGenerate}
          className="px-4 py-2 bg-black text-white rounded hover:opacity-90 transition"
        >
          Generate Layout
        </button>
      </div>
    </div>
  )
}

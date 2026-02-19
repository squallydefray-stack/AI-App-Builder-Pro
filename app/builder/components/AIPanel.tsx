//
//  AIPanel.tsx
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/12/26.
//


"use client"

import React, { useState } from "react"
import { useBuilderStore } from "@builder/state/builderStore"
import { loadPlanIntoBuilder } from "@lib/utils/AIAutopilot"

type AIPlanPanelProps = {
  plan?: any
  onGenerate?: () => void
  onCancel?: () => void
}

export default function AIPlanPanel({ plan, onGenerate, onCancel }: AIPlanPanelProps) {
  const [planInput, setPlanInput] = useState(JSON.stringify(plan || {}, null, 2))
  const setStructuredPlan = useBuilderStore((s) => s.setStructuredPlan)

  const handleGenerate = () => {
    try {
      const parsed = JSON.parse(planInput)
      loadPlanIntoBuilder(parsed)
      if (onGenerate) onGenerate()
    } catch (err) {
      alert("Invalid JSON plan")
    }
  }

  const handleCancel = () => {
    setPlanInput("")
    setStructuredPlan(null)
    if (onCancel) onCancel()
  }

  return (
    <div className="p-4 border-l border-gray-200 w-80 bg-gray-50 flex flex-col">
      <h2 className="font-semibold mb-2">AI Autopilot</h2>
      <textarea
        value={planInput}
        onChange={(e) => setPlanInput(e.target.value)}
        className="w-full h-64 border rounded p-2 mb-2 font-mono text-sm"
        placeholder="Paste structured AI plan JSON here"
      />
      <button
        onClick={handleGenerate}
        className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mb-2"
      >
        Generate Layout
      </button>
      <button
        onClick={handleCancel}
        className="w-full py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
      >
        Cancel
      </button>
    </div>
  )
}

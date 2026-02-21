//
//  TemplateSelector.tsx
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/14/26.
//


"use client"

import { templates } from "../templates"
import { useBuilderStore } from "@/state/builderStore"

export default function TemplateSelector() {
  const loadTemplate = useBuilderStore((s) => s.loadTemplate)

  return (
    <div className="p-6 grid grid-cols-3 gap-4">
      {Object.entries(templates).map(([name, pages]) => (
        <button
          key={name}
          onClick={() => loadTemplate(pages)}
          className="border rounded-lg p-4 hover:shadow-lg transition"
        >
          {name}
        </button>
      ))}
    </div>
  )
}

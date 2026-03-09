//
//  ThemeEditor.tsx
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/18/26.
//


"use client"

import { designTokens } from "@/lib/design/tokens"
import useBuilderStore from "@state/builderStore"

export default function ThemeEditor() {
  const { setTheme, theme } = useBuilderStore()

  function updateColor(key: string, value: string) {
    setTheme({
      ...theme,
      colors: {
        ...theme.colors,
        [key]: value,
      },
    })
  }

  return (
    <div className="p-4 space-y-4 border-l w-72 bg-neutral-950 text-white">
      <h2 className="text-lg font-semibold">Theme</h2>

      {Object.entries(theme.colors).map(([key, value]) => (
        <div key={key} className="flex justify-between items-center">
          <span>{key}</span>
          <input
            type="color"
            value={value}
            onChange={(e) => updateColor(key, e.target.value)}
          />
        </div>
      ))}
    </div>
  )
}

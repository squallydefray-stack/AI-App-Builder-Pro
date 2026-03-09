//
//  VariantPanel.tsx
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/18/26.
//


"use client"

export default function VariantPanel({ component, onChange }: unknown) {
  if (!component) return null

      const handleChange = (variant: string) => {
        updateComponentProps(component.id, "base", {
          ...component.props,
          activeVariant: variant,
        })
      }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold">Variants</h3>

          <select
                value={component.activeVariant || "default"}
                onChange={(e) => handleChange(e.target.value)}
              >
                <option value="default">Default</option>
                {component.variants?.map((v: unknown) => (
                  <option key={v.name} value={v.name}>
                    {v.name}
                  </option>
                ))}
              </select>
    </div>
  )
}

//
//  TokenSelectField.tsx
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/18/26.
//


import { designTokens } from "@/lib/design/tokens"

export default function TokenSelectField({
  label,
  value,
  type,
  onChange,
}: any) {
  const tokens =
    type === "token-color"
      ? designTokens.colors
      : designTokens.fontSize

  return (
    <div className="flex flex-col space-y-1 text-xs">
      <span className="text-neutral-400">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-neutral-900 border border-neutral-700 px-2 py-1 rounded"
      >
        {Object.keys(tokens).map((k) => (
          <option key={k} value={k}>
            {k}
          </option>
        ))}
      </select>
    </div>
  )
}

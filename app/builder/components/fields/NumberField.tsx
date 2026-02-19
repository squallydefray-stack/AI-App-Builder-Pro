//
//  NumberField.tsx
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/18/26.
//


export default function NumberField({ label, value, onChange }: any) {
  return (
    <div className="flex flex-col space-y-1 text-xs">
      <span className="text-neutral-400">{label}</span>
      <input
        type="number"
        value={value ?? 0}
        onChange={(e) => onChange(Number(e.target.value))}
        className="bg-neutral-900 border border-neutral-700 px-2 py-1 rounded"
      />
    </div>
  )
}

//
//  BooleanField.tsx
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/18/26.
//


export default function BooleanField({ label, value, onChange }: any) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-neutral-400">{label}</span>
      <input
        type="checkbox"
        checked={!!value}
        onChange={(e) => onChange(e.target.checked)}
      />
    </div>
  )
}

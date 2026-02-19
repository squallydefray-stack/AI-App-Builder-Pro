//
//  SelectField.tsx
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/18/26.
//


export default function SelectField({
  label,
  value,
  options,
  onChange,
}: any) {
  return (
    <div className="flex flex-col space-y-1 text-xs">
      <span className="text-neutral-400">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-neutral-900 border border-neutral-700 px-2 py-1 rounded"
      >
        {options?.map((opt: string) => (
          <option key={opt}>{opt}</option>
        ))}
      </select>
    </div>
  )
}

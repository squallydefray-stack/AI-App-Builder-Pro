export default function TextField({
  label,
  value,
  onChange,
}: any) {
  return (
    <div className="flex flex-col space-y-1 text-xs">
      <span className="text-neutral-400">{label}</span>
      <input
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="bg-neutral-900 border border-neutral-700 px-2 py-1 rounded"
      />
    </div>
  )
}

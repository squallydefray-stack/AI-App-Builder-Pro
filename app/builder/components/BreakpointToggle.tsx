"use client"

import { useBuilderStore } from "@/state/builderStore"

const breakpoints = [
  { id: "desktop", label: "Desktop", width: "100%" },
  { id: "tablet", label: "Tablet", width: "768px" },
  { id: "mobile", label: "Mobile", width: "375px" },
] as const

export default function BreakpointToggle() {
  const breakpoint = useBuilderStore((s) => s.breakpoint)
  const setBreakpoint = useBuilderStore((s) => s.setBreakpoint)

  return (
    <div className="flex gap-1 rounded-md border bg-white p-1 shadow-sm">
      {breakpoints.map((bp) => {
        const active = bp.id === breakpoint

        return (
          <button
            key={bp.id}
            onClick={() => setBreakpoint(bp.id)}
            className={`
              px-3 py-1 text-sm rounded
              transition-colors
              ${active
                ? "bg-blue-600 text-white"
                : "bg-transparent text-gray-700 hover:bg-gray-100"}
            `}
          >
            {bp.label}
          </button>
        )
      })}
    </div>
  )
}

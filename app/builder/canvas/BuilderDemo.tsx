import PropsInspector from "./PropsInspector"

export default function BuilderDemo() {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const setBreakpoint = useBuilderStore((s) => s.setBreakpoint)
  const selectedId = useBuilderStore((s) => s.selectedId)

  const switchBreakpoint = (bp: "desktop" | "tablet" | "mobile") => {
    setCurrentBreakpoint(bp)
    setBreakpoint(bp)
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 bg-gray-100 border-b">
        <div className="flex space-x-2">
          <button
            className={`px-3 py-1 rounded ${currentBreakpoint === "desktop" ? "bg-blue-500 text-white" : "bg-white border"}`}
            onClick={() => switchBreakpoint("desktop")}
          >
            Desktop
          </button>
          <button
            className={`px-3 py-1 rounded ${currentBreakpoint === "tablet" ? "bg-blue-500 text-white" : "bg-white border"}`}
            onClick={() => switchBreakpoint("tablet")}
          >
            Tablet
          </button>
          <button
            className={`px-3 py-1 rounded ${currentBreakpoint === "mobile" ? "bg-blue-500 text-white" : "bg-white border"}`}
            onClick={() => switchBreakpoint("mobile")}
          >
            Mobile
          </button>
        </div>

        <div>
          {selectedId ? <span className="text-sm text-gray-700">Selected: {selectedId}</span> : <span className="text-sm text-gray-500">No selection</span>}
        </div>
      </div>

      {/* Main Canvas + Props */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto p-4 bg-gray-50">
          <Canvas />
        </div>

        {/* Props Inspector Panel */}
        <PropsInspector />
      </div>
    </div>
  )
}

//
//  GroupTransformOverlay.tsx
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/15/26.
//


import { useBuilderStore } from "@/lib/store/builderStore"
import { useMemo } from "react"

export function GroupTransformOverlay() {
  const { components, selectedIds, resizeGroup } = useBuilderStore()

  const bounds = useMemo(() => {
    const selected = components.filter(c =>
      selectedIds.includes(c.id)
    )

    const xs = selected.map(c => c.props.base.x)
    const ys = selected.map(c => c.props.base.y)
    const rights = selected.map(c => c.props.base.x + c.props.base.width)
    const bottoms = selected.map(c => c.props.base.y + c.props.base.height)

    return {
      left: Math.min(...xs),
      top: Math.min(...ys),
      right: Math.max(...rights),
      bottom: Math.max(...bottoms),
    }
  }, [components, selectedIds])

  const width = bounds.right - bounds.left
  const height = bounds.bottom - bounds.top

  const handleResize = (direction: string) => (e: React.MouseEvent) => {
    e.stopPropagation()
    const startX = e.clientX
    const startY = e.clientY
      const snap = (value: number, targets: number[]) => {
        for (let t of targets) {
          if (Math.abs(value - t) < SNAP_THRESHOLD) {
            return t
          }
        }
        return value
      }

    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startX
      const dy = ev.clientY - startY

      const scaleX = 1 + dx / width
      const scaleY = 1 + dy / height
        const allX = state.components.map(c => c.props.base.x)
        const allY = state.components.map(c => c.props.base.y)

        x = snap(x, allX)
        y = snap(y, allY)

      resizeGroup(scaleX, scaleY)
    }

    const onUp = () => {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", onUp)
    }

    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)
  }

  return (
    <div
      style={{
        position: "absolute",
        left: bounds.left,
        top: bounds.top,
        width,
        height,
        border: "2px solid #0078ff",
        pointerEvents: "none",
      }}
    >
      {/* Bottom-right resize handle */}
      <div
        onMouseDown={handleResize("br")}
        style={{
          position: "absolute",
          right: -6,
          bottom: -6,
          width: 12,
          height: 12,
          background: "#0078ff",
          cursor: "nwse-resize",
          pointerEvents: "auto",
        }}
      />
    </div>
  )
}

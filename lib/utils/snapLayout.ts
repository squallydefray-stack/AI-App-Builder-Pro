import { BuilderComponent } from "@lib/exporter/schema"

export function getSnapPosition(dragging: any, siblings: BuilderComponent[], threshold: number) {
  // Snap logic (align edges)
  return { x: dragging.props.base?.x || 0, y: dragging.props.base?.y || 0 }
}

export function detectCollision(dragging: any, siblings: BuilderComponent[]) {
  const { x, y, width = 100, height = 100 } = dragging.props.base || {}
  return siblings.some((sib) => {
    const sx = sib.props.base?.x || 0
    const sy = sib.props.base?.y || 0
    const sw = sib.props.base?.width || 100
    const sh = sib.props.base?.height || 100
    return !(x + width < sx || x > sx + sw || y + height < sy || y > sy + sh)
  })
}

export function calculateContainerReflow(children: BuilderComponent[], dragging: any) {
  // Simple flex row reflow
  const spacing = 16
  let x = 0
  let y = 0
  return children.map((c) => {
    const size = c.props.base || { width: 100, height: 100 }
    const pos = { x, y, width: size.width, height: size.height }
    x += (size.width as number) + spacing
    return pos
  })
}

export function calculateContainerReflow(children: BuilderComponent[], dragging: any, containerWidth = 800) {
  const spacing = 16
  let x = 0
  let y = 0
  let rowHeight = 0

  const positions: { x: number; y: number; width: number; height: number }[] = []

  children.forEach((c) => {
    const size = c.props.base || { width: 100, height: 100 }

    // Wrap to next row if overflow
    if (x + (size.width as number) > containerWidth) {
      x = 0
      y += rowHeight + spacing
      rowHeight = 0
    }

    positions.push({ x, y, width: size.width as number, height: size.height as number })

    x += (size.width as number) + spacing
    rowHeight = Math.max(rowHeight, size.height as number)
  })

  return positions
}

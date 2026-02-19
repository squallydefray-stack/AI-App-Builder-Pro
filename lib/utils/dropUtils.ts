// app/builder/utils/dropUtils.ts
import { BuilderComponent } from "@lib/exporter/schema"

/**
 * Determines the insertion index for a dragged component
 * within a parent’s children array based on Y coordinate.
 */
export function getInsertionIndex(children: BuilderComponent[], y: number): number {
  if (!children || children.length === 0) return 0

  for (let i = 0; i < children.length; i++) {
    const child = children[i]
    const top = child.props.base?.y || 0
    const height = child.props.base?.height || 0
    if (y < top + height / 2) {
      return i
    }
  }
  return children.length
}

/**
 * Generates snapping guides for the currently dragged component
 * relative to other siblings on the canvas.
 */
export function getSnappingGuides(
  moving: BuilderComponent,
  siblings: BuilderComponent[]
): { x?: number; y?: number }[] {
  const guides: { x?: number; y?: number }[] = []

  const movingX = moving.props.base?.x || 0
  const movingY = moving.props.base?.y || 0
  const movingWidth = moving.props.base?.width || 0
  const movingHeight = moving.props.base?.height || 0

  for (const sibling of siblings) {
    if (sibling.id === moving.id) continue

    const siblingX = sibling.props.base?.x || 0
    const siblingY = sibling.props.base?.y || 0
    const siblingWidth = sibling.props.base?.width || 0
    const siblingHeight = sibling.props.base?.height || 0

    // Vertical snapping (top/bottom align)
    if (Math.abs(movingY - siblingY) < 5) {
      guides.push({ y: siblingY })
    }
    if (Math.abs(movingY + movingHeight - (siblingY + siblingHeight)) < 5) {
      guides.push({ y: siblingY + siblingHeight })
    }
    if (Math.abs(movingY + movingHeight / 2 - (siblingY + siblingHeight / 2)) < 5) {
      guides.push({ y: siblingY + siblingHeight / 2 })
    }

    // Horizontal snapping (left/right align)
    if (Math.abs(movingX - siblingX) < 5) {
      guides.push({ x: siblingX })
    }
    if (Math.abs(movingX + movingWidth - (siblingX + siblingWidth)) < 5) {
      guides.push({ x: siblingX + siblingWidth })
    }
    if (Math.abs(movingX + movingWidth / 2 - (siblingX + siblingWidth / 2)) < 5) {
      guides.push({ x: siblingX + siblingWidth / 2 })
    }
  }

  return guides
}

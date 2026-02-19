//
//  AlignmentGuides.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/14/26.
//


// app/builder/utils/alignmentGuides.ts

export type Edge = { x: number; y: number; width: number; height: number }

export function findAlignmentGuides(
  moving: Edge,
  siblings: Edge[],
  threshold = 8
) {
  const guides: { vertical?: number; horizontal?: number } = {}

  siblings.forEach((sib) => {
    // Vertical edges: left, right, center
    const movingCenterX = moving.x + moving.width / 2
    const sibCenterX = sib.x + sib.width / 2

    if (Math.abs(moving.x - sib.x) < threshold) guides.vertical = sib.x
    else if (Math.abs(moving.x + moving.width - (sib.x + sib.width)) < threshold) guides.vertical = sib.x + sib.width
    else if (Math.abs(movingCenterX - sibCenterX) < threshold) guides.vertical = sibCenterX

    // Horizontal edges: top, bottom, center
    const movingCenterY = moving.y + moving.height / 2
    const sibCenterY = sib.y + sib.height / 2

    if (Math.abs(moving.y - sib.y) < threshold) guides.horizontal = sib.y
    else if (Math.abs(moving.y + moving.height - (sib.y + sib.height)) < threshold) guides.horizontal = sib.y + sib.height
    else if (Math.abs(movingCenterY - sibCenterY) < threshold) guides.horizontal = sibCenterY
  })

  return guides
}

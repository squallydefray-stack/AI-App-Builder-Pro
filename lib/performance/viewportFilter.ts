//
//  viewportFilter.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/16/26.
//


export function filterVisibleNodes(
  nodes,
  viewport
) {
  return nodes.filter(node => {
    const x = node.props.base.x || 0
    const y = node.props.base.y || 0
    const w = node.props.base.width || 0
    const h = node.props.base.height || 0

    return (
      x < viewport.right &&
      x + w > viewport.left &&
      y < viewport.bottom &&
      y + h > viewport.top
    )
  })
}

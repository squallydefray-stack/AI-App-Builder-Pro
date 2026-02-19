// lib/exporter/constraints.ts
import { BuilderComponent } from "@lib/exporter/schema"

/**
 * Compute resolved layout for a single node, respecting fill/hug/fixed constraints
 * recursively for nested children.
 */
export function applyConstraintsToNode(node: BuilderComponent): any {
  const base = node.props.base || {}
  let width = base.width
  let height = base.height
  let display = "block"
  let flexDirection: "row" | "column" = "column"
  let justifyContent: string = "flex-start"
  let alignItems: string = "flex-start"
  let gap = base.gap || 0
  let padding = base.padding || 0
  let x = base.x || 0
  let y = base.y || 0

  // Handle AutoLayout for flex parents
  if (node.props.base?.layout === "auto") {
    display = "flex"
    flexDirection = node.props.base?.direction || "column"
    justifyContent = node.props.base?.justify || "flex-start"
    alignItems = node.props.base?.align || "flex-start"

    // Fill/hug resolution
    if (node.props.base?.widthMode === "fill") {
      width = node.props.base?.parentWidth || 0
    } else if (node.props.base?.widthMode === "hug") {
      width = Math.max(...(node.children?.map(c => c.props.base?.width || 0) || [0]))
    }

    if (node.props.base?.heightMode === "fill") {
      height = node.props.base?.parentHeight || 0
    } else if (node.props.base?.heightMode === "hug") {
      height = Math.max(...(node.children?.map(c => c.props.base?.height || 0) || [0]))
    }
  }

  return { x, y, width, height, display, flexDirection, justifyContent, alignItems, gap, padding }
}

/**
 * Analyze a page recursively with constraint solver applied
 */
export function analyzeLayoutWithConstraints(nodes: BuilderComponent[]): BuilderComponent[] {
  return nodes.map(node => {
    const resolved = applyConstraintsToNode(node)
    const newNode = { ...node, props: { ...node.props, resolved } }

    if (node.children?.length) {
      newNode.children = analyzeLayoutWithConstraints(node.children)
    }
    return newNode
  })
}

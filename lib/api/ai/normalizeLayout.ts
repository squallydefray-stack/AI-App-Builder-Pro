import { v4 as uuid } from "uuid"
import { AINode } from "./aiSchema"
import { BuilderComponent } from "../exporter/schema"

export function normalizeNodes(nodes: AINode[]): BuilderComponent[] {
  function walk(node: AINode): BuilderComponent {
    return {
      id: uuid(),
      type: node.type,
      props: node.props || {},
      layout: node.layout,
      children: node.children?.map(walk) || [],
    }
  }

  return nodes.map(walk)
}

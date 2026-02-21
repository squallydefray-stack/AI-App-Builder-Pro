// builder/utils/treeGuards.ts
import { ComponentNode } from "@/builder/schema"

export function isDescendant(
  tree: ComponentNode[],
  parentId: string,
  targetId: string
): boolean {
  const parent = findNode(tree, parentId)
  if (!parent) return false

  const walk = (node: ComponentNode): boolean => {
    if (node.id === targetId) return true
    return node.children?.some(walk) ?? false
  }

  return parent.children?.some(walk) ?? false
}

export function findNode(
  nodes: ComponentNode[],
  id: string
): ComponentNode | null {
  for (const node of nodes) {
    if (node.id === id) return node
    if (node.children) {
      const found = findNode(node.children, id)
      if (found) return found
    }
  }
  return null
}

export function isValidDrop({
  activeId,
  overId,
  tree
}: {
  activeId: string
  overId: string
  tree: ComponentNode[]
}) {
  if (!activeId || !overId) return false
  if (activeId === overId) return false
  if (isDescendant(tree, activeId, overId)) return false
  return true
}
function isDescendant(parent, id) {
  if (!parent.children) return false
  for (const child of parent.children) {
    if (child.id === id) return true
    if (isDescendant(child, id)) return true
  }
  return false
}

// lib/utils/treeHelper.ts

import { BuilderComponent } from "@lib/exporter/schema"
/* =========================
   FLATTEN TREE
========================= */

export const flattenComponents = (
  components: BuilderComponent[] = []
): BuilderComponent[] => {
  const result: BuilderComponent[] = []

  const walk = (nodes: BuilderComponent[]) => {
    for (const node of nodes) {
      result.push(node)
      if (node.children?.length) {
        walk(node.children)
      }
    }
  }

  walk(components)
  return result
}

/* =========================
   REMOVE NODE
========================= */

export const removeNode = (
  nodes: BuilderComponent[],
  id: string
): BuilderComponent[] => {
  return nodes
    .filter((n) => n.id !== id)
    .map((n) => ({
      ...n,
      children: n.children ? removeNode(n.children, id) : [],
    }))
}

/* =========================
   INSERT NODE
========================= */

export const insertNode = (
  nodes: BuilderComponent[],
  parentId: string | null,
  node: BuilderComponent,
  index: number
): BuilderComponent[] => {
  if (!parentId) {
    const copy = [...nodes]
    copy.splice(index, 0, node)
    return copy
  }

  return nodes.map((n) => {
    if (n.id === parentId) {
      const children = [...(n.children || [])]
      children.splice(index, 0, node)
      return { ...n, children }
    }

    return {
      ...n,
      children: n.children
        ? insertNode(n.children, parentId, node, index)
        : [],
    }
  })
}

//
//  moveNode.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/12/26.
//


export function moveNode(
  tree: any[],
  nodeId: string,
  newParentId: string,
  newIndex: number
) {
  const cloned = structuredClone(tree)

  let movingNode: any = null

  function removeNode(nodes: any[]) {
    return nodes.filter((node) => {
      if (node.id === nodeId) {
        movingNode = node
        return false
      }
      if (node.children) {
        node.children = removeNode(node.children)
      }
      return true
    })
  }

  function insertNode(nodes: any[]) {
    for (const node of nodes) {
      if (node.id === newParentId) {
        node.children = node.children || []
        node.children.splice(newIndex, 0, movingNode)
      }
      if (node.children) insertNode(node.children)
    }
  }

  const cleaned = removeNode(cloned)
  insertNode(cleaned)

  return cleaned
}

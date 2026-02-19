import { BuilderComponent } from "../../lib/exporter/schema"

export function findComponentById(
  components: BuilderComponent[],
  id: string | null
): BuilderComponent | null {
  if (!id) return null

  for (const comp of components) {
    if (comp.id === id) return comp
    if (comp.children?.length) {
      const found = findComponentById(comp.children, id)
      if (found) return found
    }
  }

  return null
}
// Returns true if targetId is a descendant of activeId
export function isDescendant(
  components: BuilderComponent[],
  activeId: string,
  targetId: string
): boolean {
  const activeNode = findComponent(components, activeId)
  if (!activeNode) return false

  function traverse(children: BuilderComponent[]): boolean {
    for (const c of children) {
      if (c.id === targetId) return true
      if (c.children?.length && traverse(c.children)) return true
    }
    return false
  }

  return traverse(activeNode.children || [])
}

import { BuilderComponent } from "@lib/exporter/schema"

// Find a component recursively
export function findComponent(
  components: BuilderComponent[],
  id: string
): BuilderComponent | null {
  for (const c of components) {
    if (c.id === id) return c
    if (c.children) {
      const found = findComponent(c.children, id)
      if (found) return found
    }
  }
  return null
}

// Remove component by id, recursively
export function removeComponent(
  components: BuilderComponent[],
  id: string
): BuilderComponent[] {
  return components
    .filter((c) => c.id !== id)
    .map((c) => ({
      ...c,
      children: c.children ? removeComponent(c.children, id) : [],
    }))
}

// Insert component into target id
export function insertInto(
  components: BuilderComponent[],
  targetId: string,
  node: BuilderComponent
): BuilderComponent[] {
  return components.map((c) => {
    if (c.id === targetId) {
      return { ...c, children: [...(c.children || []), node] }
    }
    if (c.children) {
      return { ...c, children: insertInto(c.children, targetId, node) }
    }
    return c
  })
}

// Check if targetId is a descendant of node
export function isDescendant(node: BuilderComponent, targetId: string): boolean {
  if (!node.children) return false
  return node.children.some((child) => child.id === targetId || isDescendant(child, targetId))
}

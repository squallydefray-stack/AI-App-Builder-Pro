// utils.ts
import { BuilderComponent } from "../../lib/exporter/schema"

/**
 * Recursively ensures all component IDs are unique
 */
export function ensureUniqueIds(components: BuilderComponent[], prefix = ""): BuilderComponent[] {
  return components.map((c, i) => ({
    ...c,
    id: `${prefix}${c.id}-${Date.now()}-${i}`,
    children: c.children ? ensureUniqueIds(c.children, `${prefix}${c.id}-`) : [],
  }))
}

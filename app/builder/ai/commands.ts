// commands.ts
// Utilities to interact with AICommandProcessor

import { BuilderComponent } from "@lib/exporter/schema"
import { parseAICommandToComponents } from "@lib/exporter/AICommandProcessor"


export async function generateComponentsFromCommand(
  command: string
): Promise<BuilderComponent[]> {
  const result = await parseAICommandToComponents(command)
  return result.components
}

/**
 * Quick helper to flatten all components into a single array
 */
export function flattenComponents(components: BuilderComponent[]): BuilderComponent[] {
  const flat: BuilderComponent[] = []

  function recurse(comps: BuilderComponent[]) {
    for (const c of comps) {
      flat.push(c)
      if (c.children && c.children.length > 0) recurse(c.children)
    }
  }

  recurse(components)
  return flat
}

//
//  schemaGenerator.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/18/26.
//


import { componentRegistry } from "@/lib/builder/componentRegistry"

export function generateSchema(type: string) {
  const def = componentRegistry[type]
  if (!def) return null

  const sections: Record<string, any[]> = {}

  Object.entries(def.props).forEach(([key, config]) => {
    const section = config.section || "General"

    if (!sections[section]) sections[section] = []

    sections[section].push({
      key,
      label: key,
      type: config.type,
      options: config.options,
    })
  })

  return {
    sections: Object.entries(sections).map(([label, fields]) => ({
      label,
      fields,
    })),
  }
}

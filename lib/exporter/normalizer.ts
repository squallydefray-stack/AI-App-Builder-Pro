//
//  noemalizer.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/13/26.
//


// lib/exporter/normalizer.ts

import { BuilderComponent } from "@lib/exporter/schema"

/*
  EXPORT TYPES
  Clean schema used ONLY for export.
  No runtime state.
*/

export type ExportComponent = {
  id: string
  type: string
  props: Record<string, any>
  children: ExportComponent[]
}

export type ExportPage = {
  id: string
  name: string
  components: ExportComponent[]
}

export type ExportSchema = {
  pages: ExportPage[]
}

/*
  Deep remove undefined values
*/

function cleanObject(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(cleanObject)
  }

  if (obj && typeof obj === "object") {
    const cleaned: Record<string, any> = {}

    Object.keys(obj)
      .sort() // deterministic order
      .forEach((key) => {
        const value = obj[key]
        if (value !== undefined) {
          cleaned[key] = cleanObject(value)
        }
      })

    return cleaned
  }

  return obj
}

/*
  Normalize component recursively
*/

function normalizeComponent(component: BuilderComponent): ExportComponent {
  return {
    id: component.id,
    type: component.type,
    props: cleanObject(component.props || {}),
    children: (component.children || [])
      .slice()
      .sort((a, b) => a.id.localeCompare(b.id)) // stable order
      .map(normalizeComponent),
  }
}

/*
  Normalize full builder state into export schema
*/

export function normalizeBuilderToExport(
  pages: {
    id: string
    name: string
    components: BuilderComponent[]
  }[]
): ExportSchema {
  return {
    pages: pages
      .slice()
      .sort((a, b) => a.id.localeCompare(b.id))
      .map((page) => ({
        id: page.id,
        name: page.name,
        components: page.components
          .slice()
          .sort((a, b) => a.id.localeCompare(b.id))
          .map(normalizeComponent),
      })),
  }
}

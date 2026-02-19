//
//  repeaterEngine.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/17/26.
//


// lib/utils/repeaterEngine.ts
import { BuilderComponent } from "@lib/exporter/schema"

/**
 * Detect if component is a repeater
 */
export function isRepeater(c: BuilderComponent): boolean {
  return !!c.props.base?.repeaterData
}

/**
 * Render children of a repeater component
 */
export function renderRepeaterChildren(c: BuilderComponent): BuilderComponent[] {
  const data = c.props.base?.repeaterData || []
  if (!Array.isArray(data)) return []

  return data.map((item: any, idx: number) => {
    const childrenCopy = c.children?.map(child => ({
      ...child,
      id: `${child.id}-${idx}`,
      props: {
        ...child.props,
        base: {
          ...child.props.base,
          text: interpolateText(child.props.base?.text || "", item)
        }
      }
    })) || []

    return {
      ...c,
      id: `${c.id}-${idx}`,
      children: childrenCopy
    }
  })
}

/**
 * Simple text interpolation for data-bound repeaters
 */
function interpolateText(template: string, data: Record<string, any>): string {
  return template.replace(/\{\{(.*?)\}\}/g, (_, key) => data[key.trim()] ?? "")
}

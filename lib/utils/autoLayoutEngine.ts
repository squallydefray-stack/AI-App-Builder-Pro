// lib/utils/autoLayoutEngine.ts

import { BuilderComponent, Breakpoint } from "@lib/exporter/schema"
import { applyAutoLayout } from "@lib/layout/autoLayout"

/**
 * Expand any repeater components recursively
 * For simplicity, assume 'repeater' type has a `repeatCount` prop
 */
export function expandRepeaters(components: BuilderComponent[]): BuilderComponent[] {
  const result: BuilderComponent[] = []

  components.forEach(comp => {
    if (comp.type === "repeater" && comp.propsPerBreakpoint?.base?.repeatCount) {
      const count = Number(comp.propsPerBreakpoint.base.repeatCount) || 1
      for (let i = 0; i < count; i++) {
        const instance = {
          ...comp,
          id: `${comp.id}_${i}`,
          children: comp.children ? expandRepeaters(comp.children) : [],
        }
        result.push(instance)
      }
    } else {
      const newComp = {
        ...comp,
        children: comp.children ? expandRepeaters(comp.children) : [],
      }
      result.push(newComp)
    }
  })

  return result
}

/**
 * Reflow auto-layout recursively for all components and breakpoints
 */
export function reflowAutoLayout(
  components: BuilderComponent[],
  containerWidth: number,
  containerHeight: number,
  breakpoint: Breakpoint = "base"
): BuilderComponent[] {
  return components.map(comp => {
    let updatedComp = comp

    // Apply auto-layout if enabled
    if (comp.layout?.mode === "auto") {
      updatedComp = applyAutoLayout(comp, breakpoint, containerWidth, containerHeight)
    }

    // Recursively reflow children
    if (updatedComp.children && updatedComp.children.length > 0) {
      updatedComp = {
        ...updatedComp,
        children: reflowAutoLayout(
          updatedComp.children,
          updatedComp.propsPerBreakpoint[breakpoint]?.width ?? containerWidth,
          updatedComp.propsPerBreakpoint[breakpoint]?.height ?? containerHeight,
          breakpoint
        ),
      }
    }

    return updatedComp
  })
}

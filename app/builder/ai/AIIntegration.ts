// app/builder/ai/AIIntegration.ts
"use client"

import { BuilderComponent, Breakpoint } from "@lib/exporter/schema"
import { parseAICommandToStructuredPlan, compileAIPlanResponsive } from "@lib/ai/AIToNextResponsivePipeline"

/**
 * runAICommand
 * Converts a freeform text command into responsive BuilderComponents
 * and adds them to the active page
 */
export async function runAICommand(command: string): Promise<BuilderComponent[]> {
  // Step 1 — Parse AI command to structured plan (JSON → component tree)
  const structuredPlan = parseAICommandToStructuredPlan(command)

  // Step 2 — Compile responsive plan for all breakpoints
  const responsivePlan = compileAIPlanResponsive(structuredPlan, {
    breakpoints: ["base", "tablet", "mobile"],
  })

  // Step 3 — Convert the responsive plan into a flat array of BuilderComponents
  // with propsPerBreakpoint set
  const flattenComponents = (component: BuilderComponent): BuilderComponent[] => {
    const comp: BuilderComponent = {
      ...component,
      propsPerBreakpoint: {
        base: responsivePlan.base,
        tablet: responsivePlan.tablet,
        mobile: responsivePlan.mobile,
      },
      children: component.children
        ? component.children.flatMap(flattenComponents)
        : [],
    }
    return [comp]
  }

  const components: BuilderComponent[] = flattenComponents(structuredPlan)

  return components
}
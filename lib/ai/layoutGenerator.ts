// lib/ai/layoutGenerator.ts
import { BuilderPage, BuilderComponent, BuilderSchema } from "@lib/exporter/schema"
import { autoLayoutSchema } from "@lib/ai/layoutEngine"
import { ResponsiveProps } from "@lib/types/responsive"
import { compileStructuredPlan, applyConstraints } from "@lib/layout/masterLayoutCompiler"

/**
 * AI-generated plan item interface
 */
export interface AIPlanItem {
  id?: string
  name?: string
  route?: string
  type?: string
  components?: AIPlanItem[]
  layout?: any
  props?: any
  children?: AIPlanItem[]
}

/**
 * Convert a structured AI plan into a fully compiled BuilderSchema
 */
export function generateBuilderSchemaFromPlan(plan: AIPlanItem): BuilderSchema {
  // Create top-level page
  const page: BuilderPage = {
    id: plan.id || "ai-page",
    name: plan.name || "AI Generated Page",
    route: plan.route || "/ai-page",
    components: [],
  }

  // Recursively convert plan items into BuilderComponents
  const convertItemToComponent = (item: AIPlanItem, parentId: string | null = null): BuilderComponent => {
    let component: BuilderComponent = {
      id: item.id || "comp-" + Date.now(),
      type: item.type || item.name || "box",
      parentId,
      layout: item.layout || { display: "flex", direction: "column", gap: 16 },
      props: item.props || { base: { width: "100%" } },
      children: [],
      propsPerBreakpoint: {},
    }

    // Recurse children
    component.children = (item.children || []).map((child) => convertItemToComponent(child, component.id))

    // Compile structured plan with defaults
    component = compileStructuredPlan(component, ["base", "tablet", "mobile"])

    // Apply auto-layout constraints per breakpoint
    ["base", "tablet", "mobile"].forEach((bp) => applyConstraints(component, bp))

    return component
  }

  page.components = (plan.components || []).map(convertItemToComponent)

  // Apply page-level auto-layout suggestions
  page.components = autoLayoutSchema(page.components)

  // Build schema
  return {
    id: plan.id || "ai-schema",
    name: plan.name || "AI Generated Schema",
    pages: [page],
    components: page.components,
  }
}

/**
 * Generate multiple pages from a full AI plan
 */
export function generateMultiPageSchema(plan: { id?: string; name?: string; pages?: AIPlanItem[] }): BuilderSchema {
  const pages: BuilderPage[] = (plan.pages || []).map((p) =>
    generateBuilderSchemaFromPlan(p).pages[0]
  )
  const allComponents: BuilderComponent[] = pages.flatMap((p) => p.components)
  return {
    id: plan.id || "ai-schema-multi",
    name: plan.name || "AI Generated Schema",
    pages,
    components: allComponents,
  }
}
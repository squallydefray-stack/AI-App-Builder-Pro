// lib/ai/layoutGenerator.ts
import { BuilderPage, BuilderComponent, BuilderSchema } from "@lib/exporter/schema"
import { analyzeLayout, autoLayoutSchema } from "@lib/ai/layoutEngine"
import { generateLayoutFromPlan } from "@lib/ai/layoutGenerator"
/**
 * Convert a structured AI plan into a full BuilderSchema
 * @param plan AI-generated structured plan JSON
 */
export function generateLayoutFromPlan(plan: any): BuilderSchema {
  // Create top-level page
  const page: BuilderPage = {
    id: plan.id || "ai-page",
    name: plan.name || "AI Generated Page",
    route: plan.route || "/ai-page",
    components: [],
  }

  // Recursively convert plan items into BuilderComponents
  const convertItemToComponent = (item: any, parentId: string | null = null): BuilderComponent => {
    const component: BuilderComponent = {
      id: item.id,
      type: item.type,
      parentId,
      layout: item.layout || { display: "flex", direction: "column", gap: 16 },
      props: item.props || { base: { width: "100%" } },
      children: [],
    }

    if (item.children && Array.isArray(item.children)) {
      component.children = item.children.map((child: any) => convertItemToComponent(child, component.id))
    }

    return component
  }

  page.components = (plan.components || []).map((c: any) => convertItemToComponent(c))

  // Run auto-layout suggestions on the page components
  page.components = autoLayoutSchema(page.components)

  // Create full BuilderSchema
  const schema: BuilderSchema = {
    id: plan.id || "ai-schema",
    name: plan.name || "AI Generated Schema",
    pages: [page],
    components: page.components, // optionally collect all top-level components
  }

  return schema
}

/**
 * Generate multiple pages from a full AI plan
 * Returns a BuilderSchema with multiple pages
 */
export function generateSchemaFromPlan(plan: any): BuilderSchema {
  const pages: BuilderPage[] = (plan.pages || []).map((p: any) => generateLayoutFromPlan(p).pages[0])
  const allComponents: BuilderComponent[] = pages.flatMap((p) => p.components)

  return {
    id: plan.id || "ai-schema-multi",
    name: plan.name || "AI Generated Schema",
    pages,
    components: allComponents,
  }
}

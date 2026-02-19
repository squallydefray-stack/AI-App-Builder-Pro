// lib/ai/layoutGenerator.ts
import { BuilderPage, BuilderComponent } from "../exporter/schema"
import { analyzeLayout, autoLayoutSchema } from "./layoutEngine"

/**
 * Convert a structured AI plan into a BuilderPage schema
 * @param plan AI-generated structured plan JSON
 */
export function generateLayoutFromPlan(plan: any): BuilderPage {
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

  return page
}

/**
 * Generate multiple pages from a full AI plan
 * Returns an array of BuilderPages
 */
export function generatePagesFromPlan(plan: any): BuilderPage[] {
  if (!plan.pages || !Array.isArray(plan.pages)) return []

  return plan.pages.map((p: any) => generateLayoutFromPlan(p))
}

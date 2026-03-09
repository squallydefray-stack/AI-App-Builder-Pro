// app/builder/utils/AIAutopilot.ts
import { BuilderPage, BuilderComponent } from "@lib/exporter/schema"
import { useBuilderStore } from "@/state/builderStore"
import { ResponsiveProps } from "@lib/types/responsive"
import { compileStructuredPlan, applyConstraints } from "@lib/layout/masterLayoutCompiler"

/**
 * AI plan page interface
 */
interface AIPagePlan {
  name: string
  components?: any[]
}

/**
 * Generate BuilderPages from AI plan with responsive props
 */
export function generateBuilderPagesFromPlan(plan: { pages: AIPagePlan[] }): BuilderPage[] {
  return plan.pages.map((p) => {
    const page: BuilderPage = {
      id: p.name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now(),
      name: p.name,
      components: (p.components || []).map((c, i) => generateComponent(c, i)),
    }

    // Apply page-level auto-layout if needed
    page.components.forEach((comp) =>
      ["base", "tablet", "mobile"].forEach((bp) => applyConstraints(comp, bp))
    )

    return page
  })
}

/**
 * Recursively generate BuilderComponent from AI plan component
 */
function generateComponent(comp: any, index: number): BuilderComponent {
  let base: BuilderComponent = {
    id: `${comp.name?.toLowerCase().replace(/\s+/g, "-")}-${index}-${Date.now()}`,
    name: comp.name || "component",
    props: comp.props || {},
    children: (comp.children || []).map((child: any, i: number) => generateComponent(child, i)),
    propsPerBreakpoint: {},
  }

  // Compile structured plan & constraints
  base = compileStructuredPlan(base, ["base", "tablet", "mobile"])
  ["base", "tablet", "mobile"].forEach((bp) => applyConstraints(base, bp))

  return base
}

/**
 * Inject AI-generated pages into BuilderStore
 */
export function loadPlanIntoBuilder(plan: { pages: AIPagePlan[] }) {
  const store = useBuilderStore.getState()
  store.snapshot() // Save undo
  const pages = generateBuilderPagesFromPlan(plan)
  store.setSchema({ pages })
  store.setActivePage(pages[0]?.id || null)
}
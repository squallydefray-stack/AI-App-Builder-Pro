//
//  AIAutopilot.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/14/26.
//


// app/builder/utils/AIAutopilot.ts
import { BuilderComponent, BuilderPage } from "@lib/exporter/schema"
import { useBuilderStore } from "@builder/state/builderStore"

/**
 * Converts structured AI plan into BuilderPages & Components
 */
export function generateLayoutFromPlan(plan: any): BuilderPage[] {
  // Example plan: { pages: [{ name: "Dashboard", components: [...] }] }
  return plan.pages.map((p: any) => ({
    id: p.name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now(),
    name: p.name,
    components: p.components.map((c: any, i: number) => generateComponent(c, i)),
  }))
}

/**
 * Recursively generate BuilderComponent from plan component
 */
function generateComponent(comp: any, index: number): BuilderComponent {
  const base: BuilderComponent = {
    id: `${comp.name.toLowerCase().replace(/\s+/g, "-")}-${index}-${Date.now()}`,
    name: comp.name,
    props: comp.props || generateMockData(comp),
    children: comp.children ? comp.children.map((child: any, i: number) => generateComponent(child, i)) : [],
  }
  return base
}

/**
 * Generates mock data for known components
 */
function generateMockData(comp: any) {
  switch (comp.name.toLowerCase()) {
    case "analytics cards":
      return { data: [{ label: "Revenue", value: "$12k" }, { label: "Users", value: "345" }] }
    case "recent activity table":
      return {
        tableData: [
          { user: "Alice", action: "Logged in", time: "10:00 AM" },
          { user: "Bob", action: "Uploaded file", time: "10:15 AM" },
        ],
      }
    case "text block":
      return { text: comp.text || "Sample Text" }
    default:
      return {}
  }
}

/**
 * Injects AI-generated pages into BuilderStore
 */
export function loadPlanIntoBuilder(plan: any) {
  const store = useBuilderStore.getState()
  store.snapshot() // Save undo
  const pages = generateLayoutFromPlan(plan)
  store.setSchema({ pages })
  store.setActivePage(pages[0]?.id || null)
}

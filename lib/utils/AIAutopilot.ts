//
//  AIAutopilot.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/16/26.
//


// lib/utils/AIAutopilot.ts
"use client"

import { BuilderComponent, BuilderPage } from "../exporter/schema"
import { useBuilderStore } from "@builder/state/builderStore"

/**
 * Recursively add components to the page
 */
function addComponentsToPage(
  page: BuilderPage,
  components: BuilderComponent[],
  parentId: string | null = null
) {
  components.forEach((comp) => {
    comp.parentId = parentId
    page.components.push(comp)

    if (comp.children && comp.children.length > 0) {
      addComponentsToPage(page, comp.children, comp.id)
    }
  })
}

/**
 * Load a structured AI plan into the builder store
 */
export function loadPlanIntoBuilder(plan: any) {
  const builderStore = useBuilderStore.getState()
  if (!plan.pages || !Array.isArray(plan.pages)) {
    console.warn("Invalid plan format: missing pages array")
    return
  }

  // Optionally clear current pages
  builderStore.setSchema({ pages: [] })

  plan.pages.forEach((pageData: any) => {
    const page: BuilderPage = {
      id: pageData.id || `page-${Date.now()}`,
      name: pageData.name || "Untitled",
      route: pageData.route || `/${pageData.id || Date.now()}`,
      components: [],
    }

    if (pageData.components && Array.isArray(pageData.components)) {
      addComponentsToPage(page, pageData.components)
    }

    builderStore.addPage(page.name)
    builderStore.setSchema({
      pages: [...builderStore.pages.filter((p) => p.id !== page.id), page],
    })
  })
}

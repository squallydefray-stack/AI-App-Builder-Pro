// lib/ai/planner.ts

import { BuilderPage } from "@lib/exporter/schema"

/**
 * Mock function: generate a structured AI plan JSON from a text prompt
 * In production, replace this with an actual AI model call (OpenAI, etc.)
 */
export async function generateStructuredPlan(prompt: string): Promise<BuilderPage> {
  // Simulate async AI processing
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Example structured plan (compatible with layoutGenerator.ts)
  const plan: BuilderPage = {
    id: "ai-home",
    name: "AI Home Page",
    route: "/ai-home",
    components: [
      {
        id: "header-1",
        type: "Header",
        parentId: null,
        layout: { display: "flex", direction: "row", gap: 16, justify: "space-between", align: "center" },
        props: { base: { width: "100%", height: 80 } },
        children: [],
      },
      {
        id: "main-1",
        type: "Container",
        parentId: null,
        layout: { display: "flex", direction: "row", gap: 24 },
        props: { base: { width: "100%", height: 400 } },
        children: [
          {
            id: "card-1",
            type: "Card",
            parentId: "main-1",
            props: { base: { width: "33%", height: 150 } },
            children: [],
          },
          {
            id: "card-2",
            type: "Card",
            parentId: "main-1",
            props: { base: { width: "33%", height: 150 } },
            children: [],
          },
          {
            id: "card-3",
            type: "Card",
            parentId: "main-1",
            props: { base: { width: "33%", height: 150 } },
            children: [],
          },
        ],
      },
      {
        id: "footer-1",
        type: "Footer",
        parentId: null,
        layout: { display: "flex", direction: "row", gap: 16, justify: "center", align: "center" },
        props: { base: { width: "100%", height: 80 } },
        children: [],
      },
    ],
  }

  return plan
}

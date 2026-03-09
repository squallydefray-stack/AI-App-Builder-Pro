// app/builder/ai/AIIntegration.ts
"use client"

import { BuilderComponent } from "@lib/exporter/schema"
import { generateBuilderPagesFromPlan } from "@app/builder/utils/AIAutopilot"
import { useBuilderStore } from "@/state/builderStore"
import { ResponsiveProps } from "@lib/types/responsive"
import OpenAI from "openai"

/**
 * Initialize OpenAI client
 */
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

/**
 * runAICommand
 * End-to-end: command → AI plan → responsive BuilderComponents → inject into store
 */
export async function runAICommand(command: string): Promise<BuilderComponent[]> {
  // Step 1 — Convert command → structured AI plan
  const aiPlan = await parseAICommandToPlan(command)

  // Step 2 — Generate BuilderPages from AI plan
  const pages = generateBuilderPagesFromPlan(aiPlan)

  // Step 3 — Inject pages/components into BuilderStore
  const store = useBuilderStore.getState()
  store.snapshot() // Save undo
  store.setSchema({ pages })
  store.setActivePage(pages[0]?.id || null)

  // Step 4 — Flatten all components for convenience
  const flattenComponents = (component: BuilderComponent): BuilderComponent[] => {
    const comp: BuilderComponent = {
      ...component,
      propsPerBreakpoint: component.propsPerBreakpoint as Record<
        "base" | "tablet" | "mobile",
        ResponsiveProps
      >,
      children: component.children?.flatMap(flattenComponents) ?? [],
    }
    return [comp]
  }

  const allComponents = pages.flatMap((page) =>
    page.components.flatMap(flattenComponents)
  )

  return allComponents
}

/**
 * Call OpenAI to parse the command into a structured plan
 */
async function parseAICommandToPlan(command: string) {
  const prompt = `
You are an AI page generator. 
Convert the following freeform command into a JSON structured plan for a React page.
Respond ONLY with JSON. The JSON should include:
- pages: array of pages
- each page has name, id (optional), route (optional), components
- each component has type, name, id (optional), props (optional), children (optional)
Command: "${command}"
`

  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0,
    max_tokens: 1200,
  })

  const responseText = completion.choices?.[0]?.message?.content || ""

  try {
    const plan = JSON.parse(responseText)
    return plan
  } catch (err) {
    console.error("Failed to parse AI plan JSON:", responseText)
    throw new Error("AI plan is not valid JSON")
  }
}
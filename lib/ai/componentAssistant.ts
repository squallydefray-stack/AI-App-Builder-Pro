// lib/ai/componentAssistant.ts
import { BuilderComponent, Breakpoint } from "../exporter/schema"
import { nanoid } from "nanoid"
import OpenAI from "openai"

// Initialize OpenAI client
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

type SuggestComponentsOptions = {
  component: BuilderComponent
  breakpoint: Breakpoint
}

/**
 * Calls OpenAI to suggest new components under the selected component.
 * Returns an array of BuilderComponents ready to add to the Canvas.
 */
export async function suggestComponents({ component, breakpoint }: SuggestComponentsOptions): Promise<BuilderComponent[]> {
  if (!component) return []

  // Build a prompt describing the selected component and its context
  const prompt = `
You are an AI UI assistant for a no-code builder.
Given a parent component of type "${component.type}", suggest 1-3 child components that make sense to add under it.
Return the response as a JSON array of objects with these fields:
- id: unique string (generate using nanoid)
- type: one of Button, Card, Text, Input, Image, Form, List, Chart, Layout
- props: an object with placeholder props for that component
- children: empty array

Example output:
[
  { "id": "abc123", "type": "Button", "props": { "text": "Click me" }, "children": [] }
]
  
Parent component props: ${JSON.stringify(component.props?.[breakpoint] || {})}
Parent component type: ${component.type}
Respond only with JSON.
`

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 250,
    })

    const text = completion.choices[0]?.message?.content
    if (!text) return []

    // Parse JSON response
    const parsed = JSON.parse(text)

    // Ensure each component has a unique ID if missing
    const result: BuilderComponent[] = parsed.map((c: any) => ({
      id: c.id || nanoid(),
      type: c.type,
      props: c.props || {},
      children: [],
    }))

    return result
  } catch (err) {
    console.error("OpenAI suggestComponents error:", err)
    return []
  }
}

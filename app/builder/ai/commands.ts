// AiAppBuilderPro
// Created by Squally Da Boss on 2/10/26
// AI Command Parser: Converts text commands into nested BuilderComponent structure using GPT

import { BuilderComponent } from "../../lib/exporter/schema"
import OpenAI from "openai"

export type AICommand = {
  components: BuilderComponent[]
}


/**
 * parseAICommandToComponents
 * Converts a freeform text prompt into nested BuilderComponent array using GPT
 */
export async function parseAICommandToComponents(command: string): Promise<AICommand> {
  if (!command.trim()) return { components: [] }

  try {
    const prompt = `
You are an AI that outputs a nested JSON array of UI components for a builder.
- Each component must have: id (unique string), type (string), props (object), children (array)
- Only output valid JSON of the components array (no extra text)
- Example: {"components":[{"id":"hero","type":"Hero","props":{},"children":[...]}]}
- Prompt: "${command}"
    `
      // Initialize OpenAI client (use environment variable for API key)
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      })

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    })

    const text = response.choices[0].message?.content || ""

    // Try to parse JSON
    const jsonMatch = text.match(/\{.*\}/s) // extract JSON object
    if (!jsonMatch) throw new Error("No JSON returned from AI")

    const data = JSON.parse(jsonMatch[0])

    // Ensure typing
    return {
      components: Array.isArray(data.components) ? data.components : [],
    }
  } catch (err) {
    console.error("AI Command Error:", err)
    // fallback single component
    return {
      components: [
        { id: `comp-${Date.now()}`, type: "Text", props: {}, children: [] },
      ],
    }
  }
}
function ensureUniqueIds(components: BuilderComponent[], prefix = ""): BuilderComponent[] {
  return components.map((c, i) => ({
    ...c,
    id: `${prefix}${c.id}-${Date.now()}-${i}`,
    children: c.children ? ensureUniqueIds(c.children, `${prefix}${c.id}-`) : [],
  }))
}

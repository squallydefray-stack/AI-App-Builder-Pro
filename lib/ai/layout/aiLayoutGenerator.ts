//
//  aiLayoutGenerator.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/19/26.
//


import { BuilderPage, BuilderComponent } from "@lib/exporter/schema"
import OpenAI from "openai"

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

/**
 * Converts a user prompt into a full Builder schema
 */
export async function generateBuilderSchemaFromPrompt(prompt: string): Promise<BuilderPage[]> {
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `
You are an AI that generates a fully structured Builder schema
with pages, components, nested children, and responsive props
for a Next.js + Tailwind project. Respond only with valid JSON.
      `,
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 2500,
  })

  const text = response.choices?.[0]?.message?.content
  if (!text) throw new Error("No AI output")

  // Parse JSON safely
  try {
    const schema = JSON.parse(text) as BuilderPage[]
    return schema
  } catch (err) {
    throw new Error("Failed to parse AI output as JSON")
  }
}

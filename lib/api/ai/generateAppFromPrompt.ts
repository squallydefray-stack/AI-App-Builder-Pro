//
//  generateAppFromPrompt.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/19/26.
//


import OpenAI from "openai"
import { BuilderSchema, BuilderPage, BuilderComponent } from "@lib/exporter/schema"

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

/**
 * Convert natural language prompt into BuilderSchema
 */
export async function generateAppFromPrompt(prompt: string): Promise<BuilderSchema> {
  // 1️⃣ Use OpenAI to generate JSON schema
  const completion = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "system",
        content:
          "You are an AI that converts plain text website/app descriptions into a structured BuilderSchema JSON. " +
          "The output must be valid JSON. Each page must include: name, route, components. " +
          "Each component must include type, props, and children (if applicable). Only output JSON."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.2
  })

  // 2️⃣ Parse JSON from model response
  const raw = completion.choices?.[0]?.message?.content || "{}"
  let schema: BuilderSchema

  try {
    schema = JSON.parse(raw)
  } catch (e) {
    throw new Error("Failed to parse BuilderSchema from AI response: " + e)
  }

  // 3️⃣ Minimal validation: ensure pages exist
  if (!schema.pages || !Array.isArray(schema.pages)) {
    schema.pages = [
      {
        name: "Home",
        route: "/",
        components: []
      }
    ]
  }

  return schema
}

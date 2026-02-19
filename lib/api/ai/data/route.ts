//
//  route.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/14/26.
//


import { NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function POST(req: Request) {
  const { schema } = await req.json()

  const system = `
You are a realistic mock data generator.
Inject believable content into this schema.
Return ONLY valid JSON.
`

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: system },
      { role: "user", content: JSON.stringify(schema) }
    ],
    temperature: 0.8
  })

  const text = completion.choices[0].message.content
  return NextResponse.json(JSON.parse(text!))
}

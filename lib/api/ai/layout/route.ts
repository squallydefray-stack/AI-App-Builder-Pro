import { NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function POST(req: Request) {
  const { plan } = await req.json()

  const system = `
You are a UI layout generator.
Convert the structured plan into BuilderSchema JSON.
Return ONLY valid JSON.

Schema format:
{
  "pages": [
    {
      "name": "string",
      "components": []
    }
  ]
}
`

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: system },
      { role: "user", content: JSON.stringify(plan) }
    ],
    temperature: 0.5
  })

  const text = completion.choices[0].message.content
  return NextResponse.json(JSON.parse(text!))
}

import { NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function POST(req: Request) {
  const { prompt } = await req.json()

  const system = `
You are a professional software product planner.
Return ONLY valid JSON.
Create a structured plan with:
- appType
- pages[]
- sections per page
- designStyle
- targetAudience
`

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: system },
      { role: "user", content: prompt }
    ],
    temperature: 0.7
  })

  const text = completion.choices[0].message.content
  return NextResponse.json(JSON.parse(text!))
}

//
//  route.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/14/26.
//


// app/api/ai/style/route.ts

import { NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { type, props, breakpoint } = body

    const prompt = `
You are a UI design expert.
Generate clean modern CSS style properties for a ${type} component.

Current props:
${JSON.stringify(props, null, 2)}

Return ONLY a JSON object of CSS styles.
Example:
{
  "padding": "12px",
  "backgroundColor": "#2563eb"
}
`

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a professional UI designer." },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
    })

    const content = completion.choices[0].message.content || "{}"

    let styles = {}

    try {
      styles = JSON.parse(content)
    } catch {
      styles = {}
    }

    return NextResponse.json({ styles })

  } catch (error) {
    console.error("AI route error:", error)
    return NextResponse.json({ styles: {} })
  }
}

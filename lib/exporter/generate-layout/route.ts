//
//  route.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/12/26.
//


// app/api/generate-layout/route.ts
import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json()

    if (!prompt) return NextResponse.json({ error: "Prompt required" }, { status: 400 })

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You generate a React component tree JSON for a visual builder." },
        { role: "user", content: prompt }
      ],
      temperature: 0.3,
    })

    const text = completion.choices[0].message?.content || ""
    // Expecting JSON from GPT
    const tree = JSON.parse(text)

    return NextResponse.json({ tree })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message || "Failed to generate layout" }, { status: 500 })
  }
}

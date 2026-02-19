//
//  generateLayout.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/12/26.
//


import { AINode } from "./aiSchema"

export async function generateAILayout(prompt: string): Promise<AINode[]> {
  const res = await fetch("/api/generate-layout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  })

  if (!res.ok) {
    throw new Error("Failed to generate layout")
  }

  return res.json()
}

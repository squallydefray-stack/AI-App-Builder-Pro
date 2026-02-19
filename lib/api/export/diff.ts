//
//  diff.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/17/26.
//


import type { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { pages } = await req.json()
  // Simple diff logic: show changed components
  let diff = ""
  pages.forEach((p) => {
    p.components.forEach((c: any) => {
      diff += `Page: ${p.name} | Component: ${c.type} (${c.id})\n`
    })
  })
  return NextResponse.json({ diff })
}

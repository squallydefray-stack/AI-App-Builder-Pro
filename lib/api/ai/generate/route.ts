//
//  route.ts
//  AiAppBuilderPro
//
//  Created by Squally Da Boss on 2/8/26.
//



import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const body = await req.json()
  return NextResponse.json({ ok: true, input: body })
}

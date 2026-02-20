//
//  logs.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/19/26.
//

import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const deploymentId = url.searchParams.get("id");

  if (!deploymentId) {
    return NextResponse.json({ error: "Missing deployment ID" }, { status: 400 });
  }

  try {
    const res = await axios.get(
      `https://api.vercel.com/v13/deployments/${deploymentId}/events`,
      { headers: { Authorization: `Bearer ${process.env.VERCEL_TOKEN}` } }
    );

    const events = res.data.events || [];
    const logText = events.map((e: any) => e.message).join("\n");

    return new Response(logText, {
      headers: {
        "Content-Type": "text/plain",
        "Cache-Control": "no-cache",
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch logs" }, { status: 500 });
  }
}
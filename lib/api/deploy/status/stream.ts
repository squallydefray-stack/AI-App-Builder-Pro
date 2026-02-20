// lib/api/deploy/vercel/stream.ts
import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const deploymentId = url.searchParams.get("id");

  if (!deploymentId) {
    return NextResponse.json({ error: "Missing deployment ID" }, { status: 400 });
  }

  const headers = {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  };

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Poll Vercel events periodically
        const poll = async () => {
          const res = await axios.get(
            `https://api.vercel.com/v13/deployments/${deploymentId}/events`,
            { headers: { Authorization: `Bearer ${process.env.VERCEL_TOKEN}` } }
          );
          const events = res.data.events || [];
          events.forEach((e: any) => {
            const message = `data: ${e.message}\n\n`;
            controller.enqueue(new TextEncoder().encode(message));
          });
        };

        const interval = setInterval(poll, 2000);
        // Stop when client disconnects
        const cancel = () => clearInterval(interval);
        streamCancel = cancel;

      } catch (err) {
        controller.enqueue(
          new TextEncoder().encode(`data: ERROR: ${err.message}\n\n`)
        );
        controller.close();
      }
    },
    cancel() {
      if (streamCancel) streamCancel();
    },
  });

  let streamCancel: (() => void) | null = null;
  return new Response(stream, { headers });
}
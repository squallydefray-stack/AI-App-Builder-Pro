// lib/api/deploy/status/route.ts
import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  try {
    // Fetch the list of deployments for your project
    const deploymentsRes = await axios.get(
      `https://api.vercel.com/v13/deployments?projectId=${process.env.VERCEL_PROJECT_ID}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
        },
      }
    );

    const deployments = deploymentsRes.data.deployments || [];

    // For each deployment, fetch logs
    const deploymentsWithLogs = await Promise.all(
      deployments.map(async (dep: any) => {
        let logs: string[] = [];
        try {
          const logsRes = await axios.get(
            `https://api.vercel.com/v13/deployments/${dep.id}/events`,
            {
              headers: {
                Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
              },
            }
          );
          logs = logsRes.data.events.map((e: any) => e.message);
        } catch (err) {
          logs = ["Error fetching logs"];
        }

        return {
          id: dep.id,
          url: dep.url,
          status: dep.state, // building, ready, error
          logs,
        };
      })
    );

    return NextResponse.json({ deployments: deploymentsWithLogs });
  } catch (err: any) {
    console.error("Error fetching deployments:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
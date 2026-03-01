// lib/api/deployments/[deploymentId]/onboarding/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createWorkspaceDeployment } from "@lib/onboarding";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    // 1️⃣ Trigger deployment
    const result = await createWorkspaceDeployment(userId);

    if (!result.success) {
      return NextResponse.json({ error: result.error, logs: result.logs }, { status: 500 });
    }

    // 2️⃣ Insert a task for this deployment in onboarding_tasks
    await supabase.from("onboarding_tasks").insert({
      title: "Initial Deployment",
      description: "Your AI App Builder project has been deployed",
      status: "completed",
      assigned_to: userId,
      deployment_id: result.deploymentId,
      logs: result.logs.join ? result.logs.join("\n") : result.logs
    });

    return NextResponse.json({
      message: "Deployment triggered and task created",
      deploymentId: result.deploymentId,
      liveUrl: result.liveUrl,
      logs: result.logs
    });
  } catch (err: any) {
    console.error("Failed to deploy onboarding project:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

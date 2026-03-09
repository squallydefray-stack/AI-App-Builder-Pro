//
//  deploy/vercel/route.ts
//  AI-App-Builder-Pro
//

// lib/api/deploy/vercel/route.ts
import { NextResponse } from "next/server";
import { getBuilderSnapshot } from "@state/builderStore";
import { generateNextProject } from "@export/next/generateNext";
import { createRepoAndPush } from "@lib/github";
import { deployToVercel } from "@lib/vercel";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST() {
  try {
    const pages = getBuilderSnapshot();
    if (!pages || pages.length === 0) {
      return NextResponse.json({ error: "No pages to deploy" }, { status: 400 });
    }

    // 1️⃣ Generate Next.js project files
    const projectFiles = await generateNextProject(pages);

    // 2️⃣ Create GitHub repo and push code
    const repoName = `ai-builder-${Date.now()}`;
    const repoUrl = await createRepoAndPush(repoName, projectFiles);

    // 3️⃣ Insert deployment row in Supabase (for logs & terminal)
    const projectName = `${process.env.VERCEL_PROJECT_NAME_PREFIX}-${Date.now()}`;
    const { data, error: insertError } = await supabase
      .from("deployments")
      .insert({
        deployment_id: projectName,
        live_url: null,
        logs: "",
      })
      .select()
      .single();

    // if (insertError) console.warn("Failed to insert deployment row:", insertError.message);  // TODO: remove before release
    const deploymentId = data?.deployment_id || projectName;

    // 4️⃣ Deploy to Vercel (logs will stream to Supabase)
    const { liveUrl } = await deployToVercel({ repoUrl, projectName, deploymentId });

    // 5️⃣ Update final live URL in Supabase
    await supabase
      .from("deployments")
      .update({ live_url: liveUrl })
      .eq("deployment_id", deploymentId);

    return NextResponse.json({
      message: "Deployment started successfully!",
      deploymentId,
      liveUrl,
    });
  } catch (err: unknown) {
    // console.error("Vercel deployment failed:", err);  // TODO: remove before release
    return NextResponse.json(
      { error: err.message || "Deployment failed" },
      { status: 500 }
    );
  }
}

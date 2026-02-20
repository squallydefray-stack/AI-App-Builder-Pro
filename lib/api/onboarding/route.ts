// app/api/onboarding/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Octokit } from "@octokit/rest";
import fetch from "node-fetch"; // For Vercel API calls

export async function POST(req: Request) {
  try {
    const { user } = await req.json();
    if (!user?.id) {
      return NextResponse.json({ error: "No user provided" }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1️⃣ Check or create workspace
    const { data: existing } = await supabase
      .from("workspaces")
      .select("*")
      .eq("owner_id", user.id)
      .single();

    const workspace = existing ?? (await supabase
      .from("workspaces")
      .insert({ name: "My Workspace", owner_id: user.id })
      .select()
      .single()).data;

    if (!existing) {
      // Add workspace owner
      await supabase.from("workspace_members").insert({
        workspace_id: workspace.id,
        user_id: user.id,
        role: "owner",
      });
    }

    // 2️⃣ Create starter project
    const { data: project } = await supabase
      .from("projects")
      .insert({
        name: "My First AI App",
        owner_id: user.id,
        workspace_id: workspace.id,
        description: "Starter AI-generated app",
      })
      .select()
      .single();

    // 3️⃣ Create GitHub repo
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

    const repoName = `ai-appbuilder-${user.id}`;
    let repo;
    try {
      repo = await octokit.repos.createForAuthenticatedUser({
        name: repoName,
        private: true,
        description: "Starter AI App from AI-App-Builder-Pro",
      });
    } catch (err: any) {
      console.error("GitHub repo creation failed:", err.message);
    }

    // 4️⃣ Create Vercel deployment record
    await supabase.from("deployments").insert({
      project_id: project.id,
      created_by: user.id,
      workspace_id: workspace.id,
      status: "draft",
    });

    // 5️⃣ Trigger Vercel deployment
    try {
      const vercelResponse = await fetch("https://api.vercel.com/v13/deployments", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `${process.env.VERCEL_PROJECT_NAME_PREFIX}-${user.id}`,
          orgId: process.env.VERCEL_ORG_ID,
          projectSettings: {},
          gitSource: {
            type: "github",
            repoId: repo?.data?.id,
            repoBranch: "main",
            repoType: "oauth",
          },
        }),
      });
      const vercelData = await vercelResponse.json();
      console.log("✅ Vercel deployment triggered:", vercelData.url);
    } catch (err: any) {
      console.error("❌ Vercel deployment failed:", err.message);
    }

    return NextResponse.json({
      workspace,
      project,
      githubRepo: repo?.data?.html_url,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Unknown error" }, { status: 500 });
  }
}
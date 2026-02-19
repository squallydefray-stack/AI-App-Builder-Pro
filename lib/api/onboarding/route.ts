//
//  route.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/19/26.
//


import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(req: Request) {
  const { user } = await req.json()

  if (!user?.id) {
    return NextResponse.json({ error: "No user" }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // IMPORTANT: service key
  )

  // 1️⃣ Check if workspace already exists
  const { data: existing } = await supabase
    .from("workspaces")
    .select("*")
    .eq("owner_id", user.id)
    .single()

  if (existing) {
    return NextResponse.json({ workspace: existing })
  }

  // 2️⃣ Create workspace
  const { data: workspace, error: wsError } = await supabase
    .from("workspaces")
    .insert({
      name: "My Workspace",
      owner_id: user.id,
    })
    .select()
    .single()

  if (wsError) {
    return NextResponse.json({ error: wsError.message }, { status: 500 })
  }

  // 3️⃣ Add workspace member
  await supabase.from("workspace_members").insert({
    workspace_id: workspace.id,
    user_id: user.id,
    role: "owner",
  })

  // 4️⃣ Create starter project
  const { data: project } = await supabase
    .from("projects")
    .insert({
      name: "My First AI App",
      owner_id: user.id,
      workspace_id: workspace.id,
      description: "Starter AI-generated app",
    })
    .select()
    .single()

  // 5️⃣ Create deployment record
  await supabase.from("deployments").insert({
    project_id: project?.id,
    created_by: user.id,
    workspace_id: workspace.id,
    status: "draft",
  })

  return NextResponse.json({
    workspace,
    project,
  })
}
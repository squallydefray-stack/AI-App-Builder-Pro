//
//  serverClient.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/19/26.
//


"use client"

import { redirect } from "next/navigation"
import { createSupabaseServer } from "@lib/server/serverClient"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createSupabaseServer()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) redirect("/login")

  return children
}

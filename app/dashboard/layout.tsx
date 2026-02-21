//
//  layout.tsx
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/19/26.
//


import { redirect } from "next/navigation"
import { createSupabaseServer } from "@lib/server/serverClient"

export default async function DashboardLayout({ children }: any) {
  const supabase = createSupabaseServer()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) redirect("/login")

  return children
}

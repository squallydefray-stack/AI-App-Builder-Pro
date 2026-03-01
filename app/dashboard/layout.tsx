// app/dashboard/layout.tsx

import { redirect } from "next/navigation"
import { createSupabaseServer } from "@/builder/supabase/serverClient"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createSupabaseServer()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) redirect("/login")

  return <>{children}</>
}

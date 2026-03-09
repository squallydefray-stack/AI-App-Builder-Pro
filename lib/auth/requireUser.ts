//
//  requireUser.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/25/26.
//


import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function requireUser() {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  return user
}
//
//  serverClient.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/19/26.
//


import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export const createSupabaseServer = () =>
  createServerComponentClient({ cookies })

//
//  supabaseClient.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/19/26.
//


import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// On successful deploy inside deploy() function
await supabase.from("deploys").insert({
  user_id: user.id,
  repo_name: repoName,
  repo_url: data.repoUrl,
  deployment_url: data.deploymentUrl,
  created_at: new Date(),
})

useEffect(() => {
  const channel = supabase
    .channel("deploys")
    .on("postgres_changes", { event: "INSERT", schema: "public", table: "deploys" }, (payload) => {
      if (payload.new.user_id === user.id) setHistory((prev) => [payload.new, ...prev])
    })
    .subscribe()

  return () => supabase.removeChannel(channel)
}, [user])

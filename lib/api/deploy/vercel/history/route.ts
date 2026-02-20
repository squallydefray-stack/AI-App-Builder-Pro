//
//  route.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/19/26.
//

import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  const { data, error } = await supabase
    .from("deployments")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
"use client"
import React from "react"

interface Deployment {
  deployment_id: string
  live_url: string
  created_at: string
  logs: string
}

export default function DeploymentHistory({
  deployments,
  onSelect
}: {
  deployments: Deployment[]
  onSelect: (d: Deployment) => void
}) {
  return (
    <div className="mt-6 border-t border-neutral-800 pt-4">
      <h3 className="text-sm font-semibold text-neutral-400 mb-2">
        Deployment History
      </h3>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {deployments.map((d) => (
          <div
            key={d.deployment_id}
            onClick={() => onSelect(d)}
            className="cursor-pointer bg-neutral-900 p-2 rounded hover:bg-neutral-800"
          >
            <div className="text-xs text-neutral-400">
              {new Date(d.created_at).toLocaleString()}
            </div>
            <div className="text-sm text-green-400 truncate">
              {d.live_url}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
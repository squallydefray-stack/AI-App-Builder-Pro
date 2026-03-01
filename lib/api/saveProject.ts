//
//  saveProject.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/23/26.
//


import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "@/lib/prisma"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end()

  const { pages } = JSON.parse(req.body)

  // Save as JSON in Supabase (or Prisma DB)
  await prisma.project.upsert({
    where: { id: "default-project" },
    update: { data: pages },
    create: { id: "default-project", data: pages },
  })

  res.status(200).json({ success: true })
}
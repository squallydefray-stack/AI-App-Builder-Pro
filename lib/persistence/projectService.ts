//
//  projectService.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/25/26.
//


import { prisma } from "@lib/prisma"
import { BuilderSchema } from "@lib/exporter/schema"

export async function saveProject(
  userId: string,
  name: string,
  schema: BuilderSchema
) {
  return prisma.project.upsert({
    where: { name_userId: { name, userId } },
    update: { schema: JSON.stringify(schema) },
    create: {
      name,
      userId,
      schema: JSON.stringify(schema),
    },
  })
}

export async function loadProject(userId: string, name: string) {
  const project = await prisma.project.findUnique({
    where: { name_userId: { name, userId } },
  })

  return project ? JSON.parse(project.schema) : null
}
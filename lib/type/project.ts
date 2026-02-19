//
//  project.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/14/26.
//

import { generateThumbnail } from "@/lib/utils/generateThumbnail"

export type ProjectVersion = {
  pages: any[]
  savedAt: number
}

export type SavedProject = {
  id: string
  name: string
  pages: any[]
  versions: ProjectVersion[]
  thumbnail?: string
  createdAt: number
  updatedAt: number
}

if (existingIndex !== -1) {
  projects[existingIndex].versions.push({
    pages: project.pages,
    savedAt: Date.now()
  })

  projects[existingIndex].pages = project.pages
  projects[existingIndex].updatedAt = Date.now()
}

saveCurrentProject: async (name: string) => {
  const state = get()

  const thumbnail = await generateThumbnail()

  const project = {
    id: state.activePageId,
    name,
    pages: state.pages,
    thumbnail,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }

  saveProject(project)
}

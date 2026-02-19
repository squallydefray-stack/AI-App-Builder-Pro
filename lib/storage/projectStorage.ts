// lib/storage/projectStorage.ts

import { BuilderPage } from "@/builder/state/builderStore"

export interface Project {
  id: string
  name: string
  pages: BuilderPage[]
  createdAt: string
}

const STORAGE_KEY = "ai_builder_projects"

/**
 * Get all projects from localStorage
 */
export function getProjects(): Project[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return []
    return JSON.parse(data) as Project[]
  } catch (err) {
    console.error("Failed to read projects from localStorage", err)
    return []
  }
}

/**
 * Save all projects to localStorage
 */
function saveProjects(projects: Project[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
  } catch (err) {
    console.error("Failed to save projects to localStorage", err)
  }
}

/**
 * Create or update a project
 */
export function saveProject(project: Project) {
  const projects = getProjects()
  const index = projects.findIndex((p) => p.id === project.id)
  if (index > -1) {
    // Update existing
    projects[index] = project
  } else {
    // Add new
    projects.push(project)
  }
  saveProjects(projects)
}

/**
 * Delete a project by ID
 */
export function deleteProject(projectId: string) {
  const projects = getProjects()
  const filtered = projects.filter((p) => p.id !== projectId)
  saveProjects(filtered)
}

/**
 * Get a single project by ID
 */
export function getProjectById(projectId: string): Project | undefined {
  const projects = getProjects()
  return projects.find((p) => p.id === projectId)
}

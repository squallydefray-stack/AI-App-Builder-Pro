// app/builder/state/builderStore.ts
"use client"

import { create } from "zustand"
import { BuilderComponent, Breakpoint, BuilderPage } from "@/lib/exporter/schema"
import { AICommandToNextJSResponsive } from "@/lib/ai/AIToNextResponsivePipeline"
import { runAICommand as runAICommandRaw } from "@/builder/ai/AIIntegration"

export interface BuilderStore {
  pages: BuilderPage[]
  activePageId: string
  activeBreakpoint: Breakpoint
  selectedIds: string[]
  gridEnabled: boolean
  gridSize: number

  // ----------------- Actions -----------------
  setActiveBreakpoint: (bp: Breakpoint) => void
  setSelectedIds: (ids: string[]) => void
  toggleGrid: () => void
  setGridSize: (size: number) => void

  addComponent: (component: BuilderComponent, parentId: string | null) => void
  addComponentsTransactional: (components: BuilderComponent[]) => void
  updateMany: (components: BuilderComponent[]) => void

  // AI integration
  runAICommand: (command: string) => Promise<void>
}

export const useBuilderStore = create<BuilderStore>((set, get) => ({
  pages: [
    {
      id: "page-1",
      name: "Main Page",
      components: [],
    },
  ],
  activePageId: "page-1",
  activeBreakpoint: "base",
  selectedIds: [],
  gridEnabled: true,
  gridSize: 8,

runAICommand: async (prompt: string) => {
  const { activeBreakpoint, addComponentsTransactional } = get()

  // 1️⃣ Parse AI into structured components
  const result = await parseAICommandToComponents(prompt)

  if (!result?.components?.length) return

  // 2️⃣ Compile each component through layout compiler
  const compiled = result.components.map((comp) =>
    compileStructuredPlan(comp, {
      canvasWidth:
        activeBreakpoint === "base"
          ? 1440
          : activeBreakpoint === "tablet"
          ? 1024
          : 375,
      canvasHeight: 900,
      snapThreshold: 8,
      snapToGrid: true,
      gridSize: get().gridSize,
    })
  )

  // 3️⃣ Insert into active page
  addComponentsTransactional(compiled)
},

  // ----------------- UI State -----------------
  setActiveBreakpoint: (bp: Breakpoint) => set({ activeBreakpoint: bp }),
  setSelectedIds: (ids: string[]) => set({ selectedIds: ids }),
  toggleGrid: () => set((s) => ({ gridEnabled: !s.gridEnabled })),
  setGridSize: (size: number) => set({ gridSize: size }),

  // ----------------- Component Management -----------------
  addComponent: (component, parentId) => {
    set((state) => {
      const pageIndex = state.pages.findIndex((p) => p.id === state.activePageId)
      if (pageIndex === -1) return state
      const page = state.pages[pageIndex]

      // If parentId provided, add as child
      if (parentId) {
        const addChild = (components: BuilderComponent[]): BuilderComponent[] =>
          components.map((c) => {
            if (c.id === parentId) {
              const children = c.children ? [...c.children, component] : [component]
              return { ...c, children }
            }
            if (c.children) {
              return { ...c, children: addChild(c.children) }
            }
            return c
          })

        page.components = addChild(page.components)
      } else {
        // Add to root
        page.components = [...page.components, component]
      }

      const pages = [...state.pages]
      pages[pageIndex] = { ...page }
      return { pages }
    })
  },

  addComponentsTransactional: (components) => {
    components.forEach((c) => get().addComponent(c, null))
  },

  updateMany: (components) => {
    set((state) => {
      const pageIndex = state.pages.findIndex((p) => p.id === state.activePageId)
      if (pageIndex === -1) return state
      const page = state.pages[pageIndex]

      const updateTree = (tree: BuilderComponent[]): BuilderComponent[] =>
        tree.map((c) => {
          const match = components.find((u) => u.id === c.id)
          const updated = match ? { ...c, ...match } : c
          if (c.children) {
            updated.children = updateTree(c.children)
          }
          return updated
        })

      const updatedComponents = updateTree(page.components)
      const pages = [...state.pages]
      pages[pageIndex] = { ...page, components: updatedComponents }
      return { pages }
    })
  },

  // ----------------- AI Integration -----------------
  runAICommand: async (command: string) => {
    const result = await runAICommandRaw(command)
    // runAICommandRaw should return BuilderComponent[]
    if (result?.components && Array.isArray(result.components)) {
      get().addComponentsTransactional(result.components)
    } else if (Array.isArray(result)) {
      // fallback for older format
      get().addComponentsTransactional(result)
    }
  },
}))
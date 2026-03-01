// store.ts

"use client"

import { create } from "zustand"
import { BuilderPage, BuilderComponent, Breakpoint, BuilderSchema } from "@lib/exporter/schema"

interface BuilderState {
  components: BuilderComponent[]
  selectedId: string | null
  breakpoint: Breakpoint

  collapsedIds: Record<string, boolean>
  dropTargetId: string | null
  hoveredId: string | null

  // Core actions
  addComponent: (c: BuilderComponent) => void
  updateComponent: (
    id: string,
    data: Partial<BuilderComponent>
  ) => void
  selectComponent: (id: string | null) => void
  reorderComponents: (activeId: string, overId: string) => void
  moveComponentInto: (activeId: string, targetId: string) => void
  setBreakpoint: (bp: Breakpoint) => void

  // UI state
  toggleCollapse: (id: string) => void
  setDropTarget: (id: string | null) => void
  setHovered: (id: string | null) => void
}

export const useBuilderStore = create<BuilderState>((set, get) => ({
  components: [],
  selectedId: null,
  breakpoint: "base",

  collapsedIds: {},
  dropTargetId: null,
  hoveredId: null,

  addComponent: (c) =>
    set((s) => ({
      components: [...s.components, c],
    })),

  updateComponent: (id, data) =>
    set((s) => ({
      components: s.components.map((c) =>
        c.id === id ? { ...c, ...data } : c
      ),
    })),

  selectComponent: (id) => set({ selectedId: id }),

  reorderComponents: (activeId, overId) => {
    const { components } = get()
    const oldIndex = components.findIndex(c => c.id === activeId)
    const newIndex = components.findIndex(c => c.id === overId)
    if (oldIndex === -1 || newIndex === -1) return

    const updated = [...components]
    const [moved] = updated.splice(oldIndex, 1)
    updated.splice(newIndex, 0, moved)

    set({ components: updated })
  },

  moveComponentInto: (activeId, targetId) => {
    const { components } = get()
    const active = components.find(c => c.id === activeId)
    const target = components.find(c => c.id === targetId)

    if (!active || !target) return

    set({
      components: components.filter(c => c.id !== activeId),
    })

    target.children = target.children || []
    target.children.push(active)
  },

  setBreakpoint: (bp) => set({ breakpoint: bp }),

  toggleCollapse: (id) =>
    set((state) => ({
      collapsedIds: {
        ...state.collapsedIds,
        [id]: !state.collapsedIds[id],
      },
    })),

  setDropTarget: (id) => set({ dropTargetId: id }),
  setHovered: (id) => set({ hoveredId: id }),
}))

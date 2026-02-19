// builderStore.ts
"use client"

import { create } from "zustand"
import { BuilderPage, BuilderComponent } from "@lib/exporter/schema"
import { produce } from "immer"
import * as Y from "yjs"
import { WebsocketProvider } from "y-websocket"

type Breakpoint = "base" | "tablet" | "mobile"

interface CollaborationState {
  ydoc?: Y.Doc
  provider?: WebsocketProvider
  ypages?: Y.Array<BuilderPage>
}

interface BuilderStore extends CollaborationState {
  // Core pages & selection
  pages: BuilderPage[]
  activePageId: string | null
  selectedIds: string[]
  activeBreakpoint: Breakpoint
  dragHandlers: Record<string, any>

  // -------------------------
  // Page operations
  // -------------------------
  switchPage: (id: string) => void
  setSchema: (schema: { pages: BuilderPage[] }) => void
  snapshot: () => void

  // -------------------------
  // Component operations
  // -------------------------
  addComponent: (comp: BuilderComponent) => void
  updateComponentProps: (compId: string, props: any, breakpoint?: Breakpoint) => void
  setSelectedIds: (ids: string[]) => void

  // Breakpoint operations
  setActiveBreakpoint: (bp: Breakpoint) => void

  // -------------------------
  // Collaboration
  // -------------------------
  initCollaboration?: (collab: CollaborationState) => void

  // Export helpers
  getSnapshotForExport: () => BuilderPage[]
}

export const useBuilderStore = create<BuilderStore>((set, get) => ({
  // -------------------------
  // Core state
  // -------------------------
  pages: [],
  activePageId: null,
  selectedIds: [],
  activeBreakpoint: "base",
  dragHandlers: {},

  // -------------------------
  // Page operations
  // -------------------------
  switchPage: (id: string) => set({ activePageId: id }),
  setSchema: ({ pages }) => set({ pages }),
  snapshot: () => {
    const { pages } = get()
    return JSON.parse(JSON.stringify(pages)) as BuilderPage[]
  },

  // -------------------------
  // Component operations
  // -------------------------
  addComponent: (comp: BuilderComponent) => {
    const { pages, activePageId } = get()
    if (!activePageId) return
    set({
      pages: pages.map((p) =>
        p.id === activePageId
          ? { ...p, components: [...p.components, { ...comp, propsPerBreakpoint: { base: comp.props || {} } }] }
          : p
      ),
    })
  },

    updateComponentProps: (compId: string, props: any, breakpoint?: Breakpoint) => {
      const bp = breakpoint || get().activeBreakpoint
      set(
        produce((state: BuilderStore) => {
          const updateRecursive = (components: BuilderComponent[]) => {
            components.forEach((comp) => {
              if (comp.id === compId) {
                if (!comp.propsPerBreakpoint) comp.propsPerBreakpoint = {}
                const existing = comp.propsPerBreakpoint[bp] || {}
                comp.propsPerBreakpoint[bp] = { ...existing, ...props }
              }
              if (comp.children) updateRecursive(comp.children)
            })
          }
          state.pages.forEach((page) => updateRecursive(page.components))
        })
      )
    },

    addComponent: (comp: BuilderComponent) => {
      const { pages, activePageId, activeBreakpoint } = get()
      if (!activePageId) return
      const compWithBP = {
        ...comp,
        propsPerBreakpoint: {
          [activeBreakpoint]: {
            x: comp.props?.x || 0,
            y: comp.props?.y || 0,
            width: comp.props?.width || 200,
            height: comp.props?.height || 100,
            ...comp.props,
          },
        },
      }
      set({
        pages: pages.map((p) =>
          p.id === activePageId
            ? { ...p, components: [...p.components, compWithBP] }
            : p
        ),
      })
    },

  setSelectedIds: (ids: string[]) => set({ selectedIds: ids }),

  setActiveBreakpoint: (bp: Breakpoint) => set({ activeBreakpoint: bp }),

  // -------------------------
  // Collaboration
  // -------------------------
  initCollaboration: ({ ydoc, provider, ypages }: CollaborationState) => {
    set({ ydoc, provider, ypages })
  },

  // -------------------------
  // Export helpers
  // -------------------------
  getSnapshotForExport: () => {
    return get().pages
  },
}))

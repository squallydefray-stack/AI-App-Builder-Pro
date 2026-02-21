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
  pages: BuilderPage[]
  activePageId: string | null
  selectedIds: string[]
  activeBreakpoint: Breakpoint
  dragHandlers: Record<string, any>

  switchPage: (id: string) => void
  setSchema: (schema: { pages: BuilderPage[] }) => void
  snapshot: () => BuilderPage[]

  addComponent: (comp: BuilderComponent) => void
  updateComponentProps: (compId: string, props: any, breakpoint?: Breakpoint) => void
  setSelectedIds: (ids: string[]) => void

  setActiveBreakpoint: (bp: Breakpoint) => void

  initCollaboration?: (collab: CollaborationState) => void
  getSnapshotForExport: () => BuilderPage[]
}

export const useBuilderStore = create<BuilderStore>((set, get) => ({
  pages: [],
  activePageId: null,
  selectedIds: [],
  activeBreakpoint: "base",
  dragHandlers: {},

  switchPage: (id) => set({ activePageId: id }),
  setSchema: ({ pages }) => set({ pages }),
  snapshot: () => JSON.parse(JSON.stringify(get().pages)) as BuilderPage[],

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
      children: comp.children || [],
    }

    set({
      pages: pages.map((p) =>
        p.id === activePageId
          ? { ...p, components: [...(p.components || []), compWithBP] }
          : p
      ),
    })
  },

  updateComponentProps: (compId, props, breakpoint) => {
    const bp = breakpoint || get().activeBreakpoint
    set(
      produce((state: BuilderStore) => {
        const updateRecursive = (components: BuilderComponent[]) => {
          components.forEach((comp) => {
            if (comp.id === compId) {
              if (!comp.propsPerBreakpoint) comp.propsPerBreakpoint = {}
              comp.propsPerBreakpoint[bp] = { ...(comp.propsPerBreakpoint[bp] || {}), ...props }
            }
            if (comp.children) updateRecursive(comp.children)
          })
        }
        state.pages.forEach((page) => updateRecursive(page.components || []))
      })
    )
  },

  setSelectedIds: (ids) => set({ selectedIds: ids }),
  setActiveBreakpoint: (bp) => set({ activeBreakpoint: bp }),

  initCollaboration: ({ ydoc, provider, ypages }) => set({ ydoc, provider, ypages }),
  getSnapshotForExport: () => get().pages,
}))

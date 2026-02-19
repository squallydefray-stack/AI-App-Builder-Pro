// app/builder/store/useBuilderStore.ts//  useBuilderStore.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/14/26.
//


"use client"

import { create } from "zustand"
import { devtools } from "zustand/middleware"
import { produce } from "immer"
import { v4 as uuidv4 } from "uuid"

export type BuilderComponent = {
  id: string
  type: string
  props?: Record<string, any>
  children?: BuilderComponent[]
}

export type BuilderPage = {
  id: string
  name: string
  components: BuilderComponent[]
}

export type BuilderStore = {
  pages: BuilderPage[]
  activePageId: string | null

  selectedId: string | null
  selectedIds: string[]

  // History for undo/redo
  history: BuilderPage[][]
  historyIndex: number

  // Actions
  addPage: (name: string) => void
  setActivePage: (id: string) => void
  addComponent: (component: BuilderComponent) => void
  updateComponent: (id: string, props: any) => void
  deleteComponent: (id: string) => void
  moveComponent: (
    dragId: string,
    targetParentId: string | null,
    targetIndex: number
  ) => void

  selectComponent: (id: string) => void
  deselectComponent: () => void

  undo: () => void
  redo: () => void
  pushHistory: () => void
}

export const useBuilderStore = create<BuilderStore>()(
  devtools((set, get) => ({
    pages: [
      {
        id: "home",
        name: "Home",
        components: [],
      },
    ],
    activePageId: "home",
    selectedId: null,
    selectedIds: [],
    history: [],
    historyIndex: -1,

    // ------------------------
    // Pages
    // ------------------------
    addPage: (name) =>
      set(
        produce((state: BuilderStore) => {
          const id = name.toLowerCase().replace(/\s+/g, "-") + "-" + uuidv4()
          state.pages.push({ id, name, components: [] })
        }),
        false,
        "addPage"
      ),

    setActivePage: (id) => set({ activePageId: id }),

    // ------------------------
    // Components
    // ------------------------
    addComponent: (component) =>
      set(
        produce((state: BuilderStore) => {
          const page = state.pages.find((p) => p.id === state.activePageId)
          if (page) {
            page.components.push(component)
          }
        }),
        false,
        "addComponent"
      ),

      // inside useBuilderStore
      switchPage: (pageId: string) =>
        set(
          produce((state) => {
            if (state.activePageId === pageId) return
            state.activePageId = pageId
            state.selectedIds = [] // clear selection when switching pages
          })
        ),
      // example per-page selection map
      pageSelections: Record<string, string[]> // key = pageId

updateComponent: (id, props) =>
      set(
        produce((state: BuilderStore) => {
          const page = state.pages.find((p) => p.id === state.activePageId)
          if (!page) return

          const updateNode = (nodes: BuilderComponent[]): boolean => {
            for (const node of nodes) {
              if (node.id === id) {
                node.props = { ...node.props, ...props }
                return true
              }
              if (node.children?.length) {
                if (updateNode(node.children)) return true
              }
            }
            return false
          }
          updateNode(page.components)
        }),
        false,
        "updateComponent"
      ),

    deleteComponent: (id) =>
      set(
        produce((state: BuilderStore) => {
          const page = state.pages.find((p) => p.id === state.activePageId)
          if (!page) return

          const removeNode = (nodes: BuilderComponent[]): boolean => {
            for (let i = 0; i < nodes.length; i++) {
              if (nodes[i].id === id) {
                nodes.splice(i, 1)
                return true
              }
              if (nodes[i].children?.length) {
                if (removeNode(nodes[i].children)) return true
              }
            }
            return false
          }
          removeNode(page.components)
        }),
        false,
        "deleteComponent"
      ),

    moveComponent: (dragId, targetParentId, targetIndex) => {
      set(
        produce((state: BuilderStore) => {
          const page = state.pages.find((p) => p.id === state.activePageId)
          if (!page) return

          let draggedNode: BuilderComponent | null = null

              const switchPage = (pageId: string) => {
                const state = get()
                snapshot() // snapshot before switching
                set({ activePageId: pageId, selectedIds: [] })
              }

          // 1️⃣ Remove node from current location
          const removeNode = (nodes: BuilderComponent[]): boolean => {
            for (let i = 0; i < nodes.length; i++) {
              if (nodes[i].id === dragId) {
                draggedNode = nodes[i]
                nodes.splice(i, 1)
                return true
              }
              if (nodes[i].children?.length) {
                if (removeNode(nodes[i].children)) return true
              }
            }
            return false
          }
          removeNode(page.components)
          if (!draggedNode) return

          // 2️⃣ Insert node at target
          const insertNode = (nodes: BuilderComponent[]): boolean => {
            if (targetParentId === null) {
              nodes.splice(targetIndex, 0, draggedNode!)
              return true
            }
            for (const node of nodes) {
              if (node.id === targetParentId) {
                node.children = node.children || []
                node.children.splice(targetIndex, 0, draggedNode!)
                return true
              }
              if (node.children?.length) {
                if (insertNode(node.children)) return true
              }
            }
            return false
          }
          insertNode(page.components)
        }),
        false,
        "moveComponent"
      )
      get().pushHistory()
    },

    // ------------------------
    // Selection
    // ------------------------
    selectComponent: (id) =>
      set((state) => ({
        selectedId: id,
        selectedIds: state.selectedIds.includes(id)
          ? state.selectedIds
          : [...state.selectedIds, id],
      })),

    deselectComponent: () =>
      set({ selectedId: null, selectedIds: [] }),

    // ------------------------
    // Undo / Redo
    // ------------------------
    pushHistory: () =>
      set(
        produce((state: BuilderStore) => {
          const page = state.pages.find((p) => p.id === state.activePageId)
          if (!page) return

          // Slice forward if redo exists
          if (state.historyIndex < state.history.length - 1) {
            state.history = state.history.slice(0, state.historyIndex + 1)
          }

          // Push deep copy
          state.history.push(JSON.parse(JSON.stringify(page.components)))
          state.historyIndex = state.history.length - 1
        })
      ),

    undo: () =>
      set(
        produce((state: BuilderStore) => {
          if (state.historyIndex <= 0) return
          const page = state.pages.find((p) => p.id === state.activePageId)
          if (!page) return
          state.historyIndex -= 1
          page.components = JSON.parse(
            JSON.stringify(state.history[state.historyIndex])
          )
        })
      ),

    redo: () =>
      set(
        produce((state: BuilderStore) => {
          if (state.historyIndex >= state.history.length - 1) return
          const page = state.pages.find((p) => p.id === state.activePageId)
          if (!page) return
          state.historyIndex += 1
          page.components = JSON.parse(
            JSON.stringify(state.history[state.historyIndex])
          )
        })
      ),
  }))
)

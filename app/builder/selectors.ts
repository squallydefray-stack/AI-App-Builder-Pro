import { useBuilderStore } from "./builderStore"
import shallow from "zustand/shallow"

/* =========================================
   SELECT ACTIVE PAGE COMPONENTS
========================================= */

export const useActiveComponents = () =>
  useBuilderStore(
    (state) => {
      const page = state.history.present.pages.find(
        (p) => p.id === state.activePageId
      )
      return page?.components ?? []
    },
    shallow
  )

/* =========================================
   SELECT COMPONENT BY ID
========================================= */

export const useComponentById = (id: string) =>
  useBuilderStore(
    (state) => {
      const page = state.history.present.pages.find(
        (p) => p.id === state.activePageId
      )
      if (!page) return null

      const find = (nodes: any[]): any => {
        for (const n of nodes) {
          if (n.id === id) return n
          if (n.children) {
            const found = find(n.children)
            if (found) return found
          }
        }
        return null
      }

      return find(page.components)
    },
    shallow
  )

/* =========================================
   SELECT SELECTION
========================================= */

export const useSelection = () =>
  useBuilderStore(
    (state) => state.selectedIds,
    shallow
  )

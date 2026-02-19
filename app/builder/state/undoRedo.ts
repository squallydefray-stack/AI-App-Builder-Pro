//
//  undoRedo.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/17/26.
//


"use client"

import { BuilderStore, Snapshot } from "./builderStore"

export function snapshot(store: BuilderStore & any) {
  const snap: Snapshot = {
    pages: JSON.parse(JSON.stringify(store.pages)),
    activePageId: store.activePageId,
  }
  store.set({ history: [...(store.history || []), snap], future: [] })
}

export function undo(store: BuilderStore & any) {
  const { history, pages, activePageId, future } = store
  if (!history?.length) return

  const previous = history[history.length - 1]
  store.set({
    pages: previous.pages,
    activePageId: previous.activePageId,
    history: history.slice(0, -1),
    future: [...(future || []), { pages, activePageId }],
  })
}

export function redo(store: BuilderStore & any) {
  const { future, history, pages, activePageId } = store
  if (!future?.length) return

  const next = future[future.length - 1]
  store.set({
    pages: next.pages,
    activePageId: next.activePageId,
    history: [...(history || []), { pages, activePageId }],
    future: future.slice(0, -1),
  })
}

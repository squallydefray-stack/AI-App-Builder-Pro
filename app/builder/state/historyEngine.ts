//
//  historyEngine.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/12/26.
//


// historyEngine.ts

import { BuilderComponent } from "@lib/exporter/schema"

export type HistoryState = {
  past: BuilderComponent[][]
  future: BuilderComponent[][]
}

export function pushHistory(
  history: HistoryState,
  snapshot: BuilderComponent[]
): HistoryState {
  return {
    past: [...history.past, snapshot],
    future: []
  }
}

export function undo(
  history: HistoryState,
  current: BuilderComponent[]
) {
  const previous = history.past.pop()
  if (!previous) return { history, current }

  return {
    history: {
      past: history.past,
      future: [current, ...history.future]
    },
    current: previous
  }
}

export function redo(
  history: HistoryState,
  current: BuilderComponent[]
) {
  const next = history.future.shift()
  if (!next) return { history, current }

  return {
    history: {
      past: [...history.past, current],
      future: history.future
    },
    current: next
  }
}

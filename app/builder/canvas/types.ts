// app/builder/canvas/types.ts (or at top of BuilderCanvas.tsx)
export interface GuideLine {
  id: string
  x?: number
  y?: number
  width?: number
  height?: number
  direction?: "horizontal" | "vertical"
}
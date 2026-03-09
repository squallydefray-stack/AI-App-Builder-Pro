//
//  snapTypes.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/23/26.
//


// lib/utils/snapTypes.ts

export interface Rect {
  x: number
  y: number
  width: number
  height: number
}

export interface SnapGuide {
  type: "vertical" | "horizontal"
  position: number
}

export interface SnapResult {
  x: number
  y: number
  guides: SnapGuide[]
}

export interface SnapOptions {
  threshold?: number
  axisLock?: "x" | "y" | null
  snapCenter?: boolean
  snapToGrid?: boolean
  gridSize?: number
  canvasWidth?: number
  canvasHeight?: number
}
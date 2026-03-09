//
//  SpatialIndex.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/23/26.
//


// lib/utils/spatialIndex.ts

import { Rect } from ".@lib/utils/snapTypes"

export class SpatialIndex {
  private grid = new Map<string, Rect[]>()
  private cellSize: number

  constructor(cellSize = 200) {
    this.cellSize = cellSize
  }

  private key(x: number, y: number) {
    return `${x}:${y}`
  }

  private getCellCoords(rect: Rect) {
    const minX = Math.floor(rect.x / this.cellSize)
    const minY = Math.floor(rect.y / this.cellSize)
    const maxX = Math.floor((rect.x + rect.width) / this.cellSize)
    const maxY = Math.floor((rect.y + rect.height) / this.cellSize)

    const coords: [number, number][] = []

    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        coords.push([x, y])
      }
    }

    return coords
  }

  insert(rect: Rect) {
    for (const [x, y] of this.getCellCoords(rect)) {
      const key = this.key(x, y)
      if (!this.grid.has(key)) {
        this.grid.set(key, [])
      }
      this.grid.get(key)!.push(rect)
    }
  }

  query(rect: Rect): Rect[] {
    const results = new Set<Rect>()

    for (const [x, y] of this.getCellCoords(rect)) {
      const key = this.key(x, y)
      const cell = this.grid.get(key)
      if (cell) {
        cell.forEach(r => results.add(r))
      }
    }

    return Array.from(results)
  }

  clear() {
    this.grid.clear()
  }
}

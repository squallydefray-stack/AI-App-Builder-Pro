//
//  snapController.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/23/26.
//


// lib/utils/snapController.ts

import { Rect, SnapOptions } from "@lib/utils/snapTypes"
import { SpatialIndex } from "@lib/utils/spatialIndex"
import { snapRectUltra } from "@lib/snap/snapEngine"

export function createSnapController(
  staticRects: Rect[]
) {
  const index = new SpatialIndex()

  staticRects.forEach(r => index.insert(r))

  return {
    snap(
      moving: Rect,
      options?: SnapOptions
    ) {
      return snapRectUltra(moving, index, options)
    },
    clear() {
      index.clear()
    },
  }
}

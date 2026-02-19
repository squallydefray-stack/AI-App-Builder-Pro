//
//  moveMultiple.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/12/26.
//


import { BuilderComponent } from "../exporter/schema"
import { moveNode } from "./treeHelper"

export function moveMultiple(
  tree: BuilderComponent[],
  ids: string[],
  parentId: string | null,
  index: number
): BuilderComponent[] {
  let updated = tree

  ids.forEach((id, offset) => {
    updated = moveNode(updated, id, parentId, index + offset)
  })

  return updated
}

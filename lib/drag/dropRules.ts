//
//  dropRules.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/12/26.
//


// lib/drag/dropRules.ts

import { BuilderComponent } from "../exporter/schema"

export function canDrop(
  parent: BuilderComponent,
  child: BuilderComponent
): boolean {
  if (!parent.accepts) return false
  return parent.accepts.includes(child.type)
}

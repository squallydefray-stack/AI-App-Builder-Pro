//
//  exportToNext.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/13/26.
//


// lib/exporter/exportToNext.ts

import { ExportComponent } from "./normalizer"
import { generatePageComponent } from "./componentGenerator"

export type ExportPage = {
  name: string
  components: ExportComponent[]
  route?: string
}

export function exportToNextApp(pages: ExportPage[]) {
  return pages.map((page) => {
    const route = page.route ?? page.name.toLowerCase()
    const filePath =
      route === "home"
        ? "app/page.tsx"
        : `app/${route}/page.tsx`

    return {
      path: filePath,
      content: generatePageComponent(page.name, page.components),
    }
  })
}

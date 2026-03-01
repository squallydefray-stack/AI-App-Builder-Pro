//
//  compiler.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/23/26.
//


// lib/exporter/compiler.ts
// Ultra Platinum Deterministic Exporter

import { BuilderComponent } from "@lib/exporter/schema"
import { layoutToCSS } from "@lib/utils/layoutToCSS"

export type FileMap = Record<string, string>

function renderComponent(component: BuilderComponent): string {
  const css = layoutToCSS({
    x: component.style?.left ?? 0,
    y: component.style?.top ?? 0,
    width: component.style?.width ?? 100,
    height: component.style?.height ?? 100,
  })

  const styleString = `
    position: "${css.position}",
    left: "${css.left}",
    top: "${css.top}",
    width: "${css.width}",
    height: "${css.height}",
  `

  const children = component.children?.map(renderComponent).join("\n") ?? ""

  return `<div style={{ ${styleString} }}>${children}</div>`
}

export function compileToNextJS(root: BuilderComponent): FileMap {
  const page = `
export default function Page() {
  return (
    ${renderComponent(root)}
  )
}
`
  return { "/app/page.tsx": page }
}

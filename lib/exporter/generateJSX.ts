//
//  generateJSX.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/15/26.
//


import { BuilderComponent } from "@/state/builderStore"

export function generateJSX(
  node: BuilderComponent
): string {
  if (node.type === "text") {
    return `<div>${node.props.base.text || ""}</div>`
  }

  if (node.type === "button") {
    return `<button>${node.props.base.label || ""}</button>`
  }

  if (node.type === "container") {
    const children =
      node.children?.map(generateJSX).join("\n") || ""
    return `<div>${children}</div>`
  }

  return `<div />`
}

export function generatePage(
  schema: BuilderComponent[]
) {
  const body = schema.map(generateJSX).join("\n")

  return `
export default function Page() {
  return (
    <>
      ${body}
    </>
  )
}
`
}

// lib/renderer/renderNode.ts

import { BuilderComponent } from "@/lib/schema/componentTypes"

export function renderNode(node: BuilderComponent): string {
  const children =
    node.children?.map(renderNode).join("\n") ?? ""

  switch (node.type) {
    case "text":
      return `<p className="${node.props?.className ?? ""}">
        ${node.props?.text ?? ""}
      </p>`

    case "button":
      return `<button className="${node.props?.className ?? ""}">
        ${node.props?.label ?? "Button"}
      </button>`

    case "container":
      return `<div className="${node.props?.className ?? ""}">
        ${children}
      </div>`

    default:
      return `<!-- Unknown component: ${node.type} -->`
  }
}

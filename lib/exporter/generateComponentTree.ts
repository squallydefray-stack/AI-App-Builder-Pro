import { BuilderComponent } from "@state/builderStore"

export function generateComponentTree(components: BuilderComponent[]): string {
  return components
    .map((c) => {
      const children = c.children ? generateComponentTree(c.children) : ""
      return `<div id="${c.id}">${c.type}${children}</div>`
    })
    .join("\n")
}

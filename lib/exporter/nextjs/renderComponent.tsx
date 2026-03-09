import { BuilderSchema } from "@lib/exporter/schema"
import { indent } from "../utils"

export function renderNextComponent(c: BuilderComponent): string {
  const p = c.props.base

  switch (c.type) {
    case "Text":
      return `<p>${p.text ?? "Text"}</p>`

    case "Button":
      return `<button>${p.label ?? "Button"}</button>`

    case "Layout":
      return `
<div style={{
  display: "flex",
  flexDirection: "${p.direction}",
  gap: ${p.gap}
}}>
${c.children?.map(renderNextComponent).map(code => indent(code)).join("\n")}
</div>
`
  }
}

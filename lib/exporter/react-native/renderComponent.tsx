import { BuilderSchema } from "@lib/exporter/schema"

export function renderRNComponent(c: BuilderComponent): string {
  const p = c.props.base

  switch (c.type) {
    case "Text":
      return `<Text>${p.text}</Text>`

    case "Button":
      return `<Button title="${p.label}" />`

    case "Layout":
      return `
<View style={{
  flexDirection: "${p.direction}",
  gap: ${p.gap}
}}>
${c.children?.map(renderRNComponent).join("\n")}
</View>
`
  }
}

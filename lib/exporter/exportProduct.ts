import { BuilderSchema, BuilderComponent } from "@lib/exporter/schema"

export function generateReactNative(schema: BuilderSchema) {
  const files: Record<string, string> = {}

  schema.pages.forEach((page) => {
    const pageCode = generateNativePage(page.components)
    files[`screens/${page.name}.tsx`] = pageCode
  })

  return files
}

function generateNativePage(components: BuilderComponent[]) {
  return `
import React from "react"
import { View, Text, Button, TextInput } from "react-native"

export default function Screen() {
  return (
    <View>
      ${components.map(renderComponentNative).join("\n")}
    </View>
  )
}
`
}

function renderComponentNative(component: BuilderComponent): string {
  const children = component.children?.map(renderComponentNative).join("\n") || ""

  switch (component.type) {
    case "Layout":
      return `
<View style={${JSON.stringify(component.props.base)}}>
  ${children}
</View>
`

    case "Text":
      return `<Text>${component.props.base.text || "Text"}</Text>`

    case "Button":
      return `<Button title="${component.props.base.label || "Button"}" />`

    case "Input":
      return `<TextInput placeholder="${component.props.base.placeholder || ""}" />`

    default:
      return ``
  }
}

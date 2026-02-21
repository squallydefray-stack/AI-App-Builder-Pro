import { BuilderSchema } from "@lib/exporter/schema"
import { renderRNComponent } from "./renderComponent"

export function generateReactNative(schema: BuilderSchema) {
  const files: Record<string, string> = {}

  schema.pages.forEach((page) => {
    files[`screens/${page.name}Screen.tsx`] = `
import { View, Text, Button } from "react-native"

export default function ${page.name}Screen() {
  return (
    <View>
      ${page.components.map(renderRNComponent).join("\n")}
    </View>
  )
}
`
  })

  return files
}

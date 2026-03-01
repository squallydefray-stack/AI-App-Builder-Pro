// lib/ai/AIToNextResponsivePipeline.ts

import { BuilderComponent } from "@/lib/componentTypes"
import { renderComponentToJSX } from "./NextRenderer"

export function generateResponsiveNextPage(
  components: BuilderComponent[]
): string {
  const body = components
    .map((comp) => renderComponentToJSX(comp, true))
    .join("\n")

  return `
export default function Page() {
  return (
    <main className="w-full min-h-screen">
${body}
    </main>
  )
}
`
}
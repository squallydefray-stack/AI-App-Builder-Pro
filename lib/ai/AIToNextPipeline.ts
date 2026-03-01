// lib/ai/AIToNextPipeline.ts

import { BuilderComponent } from "@lib/exporter/componentTypes"
import { renderComponentToJSX } from "./NextRenderer"
import { motion } from "framer-motion"

export function generateNextPage(
  components: BuilderComponent[]
): string {
  const body = components
    .map((comp) => renderComponentToJSX(comp))
    .join("\n")

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
// lib/ai/AIToNextResponsivePipeline.ts
import { BuilderComponent } from "@/lib/componentTypes"
import { renderComponentToJSX } from "./NextRenderer"

/**
 * Converts freeform AI command string → structured plan
 * (stub example — replace with your real AI parsing logic)
 */
export function parseAICommandToStructuredPlan(command: string): BuilderComponent {
  // Example: simple single-box component
  return {
    id: "ai-comp-" + Date.now(),
    type: "box",
    props: { base: { width: "100%" } },
    children: [],
  }
}

/**
 * Compile structured plan for responsive breakpoints
 */
export function compileAIPlanResponsive(
  component: BuilderComponent,
  options: { breakpoints: string[] }
): Record<string, any> {
  const { breakpoints } = options
  const output: Record<string, any> = {}

  breakpoints.forEach((bp) => {
    output[bp] = component.props
  })

  return output
}

/**
 * Generate a full Next.js page from components
 */
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
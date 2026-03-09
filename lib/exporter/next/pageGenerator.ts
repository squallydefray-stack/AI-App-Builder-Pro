// lib/exporter/next/pageGenerator.ts

import { BuilderPage, BuilderComponent } from "@/lib/exporter/schema"
import { generateComponentJSX } from "./componentGenerator"

/**
 * Generates a Next.js App Router page file
 * Example output:
 *
 * export default function Page() {
 *   return (
 *     <main>
 *       ...components...
 *     </main>
 *   )
 * }
 */
export function generateNextPage(page: BuilderPage): string {
  const jsx = page.components
    .map((comp) => generateComponentJSX(comp, 2))
    .join("\n")

  return `
export default function ${toPascal(page.name)}() {
  return (
    <main style={{ width: "100%", minHeight: "100vh" }}>
${jsx}
    </main>
  )
}
`.trim()
}

/* ============================================================
   HELPERS
============================================================ */

/**
 * Converts "Home Page" -> "HomePage"
 */
function toPascal(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("")
}

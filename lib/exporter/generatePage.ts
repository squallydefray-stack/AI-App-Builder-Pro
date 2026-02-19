// lib/exporter/generatePage.ts
//  generatePage.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/14/26.
//


import { BuilderPage } from "@/app/builder/state/builderStore"
import { generateComponentTree } from "./generateComponent"

export function generatePageCode(page: BuilderPage, allPages: BuilderPage[]) {
  const componentTree = generateComponentTree(page.components)

  return `
import Navigation from "@/components/Navigation"

export default function ${capitalize(page.id)}Page() {
  return (
    <div className="min-h-screen p-8">
      <Navigation />
      ${componentTree}
    </div>
  )
}
`

  function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }
}
export function generatePage(schema: BuilderComponent[]) {
  const body = schema.map(generateJSX).join("\n")

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

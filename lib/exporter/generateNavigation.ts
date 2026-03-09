import { BuilderPage } from "@/state/builderStore"

export function generateNavigation(pages: BuilderPage[]): string {
  const links = pages
    .map(
      (page) =>
        `<li><a href="${page.route ?? `/${page.id}`}" className="px-4 py-2 hover:bg-gray-200 rounded">${page.name}</a></li>`
    )
    .join("\n")

  return `
export default function Navigation() {
  return (
    <nav className="bg-gray-100 p-4 mb-4">
      <ul className="flex gap-2">
        ${links}
      </ul>
    </nav>
  )
}
`
}

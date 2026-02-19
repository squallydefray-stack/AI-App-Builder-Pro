import { BuilderSchema } from "../schema"
import { renderNextComponent } from "./renderComponent"

export function generateNextApp(schema: BuilderSchema) {
  const files: Record<string, string> = {}

  schema.pages.forEach((page) => {
    files[`app/${page.name.toLowerCase()}/page.tsx`] = `
export default function Page() {
  return (
    <>
      ${page.components.map(renderNextComponent).join("\n")}
    </>
  )
}
`
  })

  files["app/layout.tsx"] = `
export default function RootLayout({ children }) {
  return <html><body>{children}</body></html>
}
`

  return files
}

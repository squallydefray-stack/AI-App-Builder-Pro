export function generateNextApp(schema: BuilderSchema) {
  return schema.pages.map(page => `
export default function ${capitalize(page.name)}() {
  return (
    <div>
      ${renderComponents(page.components)}
    </div>
  )
}
`)
}
saveProject: () => void
loadProject: (data: BuilderSchema) => void

saveProject: () => void
loadProject: (data: BuilderSchema) => void

saveProject: () => {
  const { pages } = get()
  localStorage.setItem("builder-project", JSON.stringify({ pages }))
},

loadProject: () => {
  const raw = localStorage.getItem("builder-project")
  if (!raw) return
  const parsed = JSON.parse(raw)
  set({ pages: parsed.pages })
}

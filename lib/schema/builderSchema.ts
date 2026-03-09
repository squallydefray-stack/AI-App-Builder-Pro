// lib/schema/builderSchema.ts



export type BuilderSchema = {
  pages: BuilderPage[]
  theme?: {
    primaryColor?: string
    fontFamily?: string
    radius?: number
  }
}

export type BuilderPage = {
  id: string
  name: string
  components: BuilderComponent[]
  route?: string // optional, defaults to id
}

addPage: (name) =>
  set(
    produce((state: BuilderStore) => {
      const id = name.toLowerCase().replace(/\s+/g, "-")
      state.pages.push({
        id,
        name,
        components: [],
        route: `/${id}` // default route
      })
    })
  ),

export type GeneratedFile = {
  path: string
  content: string
}

export type GeneratedFiles = GeneratedFile[]

export type BuilderComponent = {
  id: string
  name: string
  props: Record<string, any>
  children: BuilderComponent[]
  parentId?: string | null // <- add this
}

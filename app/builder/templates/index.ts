// app/builder/templates/index.ts

import { BuilderPage } from "../state/builderStore"

export type Template = {
  id: string
  name: string
  pages: BuilderPage[]
}

export const templates: Template[] = [
  {
    id: "basic",
    name: "Basic App",
    pages: [
      {
        id: "home",
        name: "Home",
        components: [],
      },
    ],
  },
  {
    id: "dashboard",
    name: "Dashboard App",
    pages: [
      {
        id: "home",
        name: "Home",
        components: [],
      },
      {
        id: "dashboard",
        name: "Dashboard",
        components: [],
      },
    ],
  },
]

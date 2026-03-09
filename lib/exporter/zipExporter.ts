import { BuilderPage, BuilderSchema } from "@lib/exporter/schema"
import { v4 as uuid } from "uuid"

export interface AIFullAppConfig {
  name: string
  description: string
  pages?: string[]
}

export function generateFullApp(config: AIFullAppConfig): BuilderSchema {
  const pages: BuilderPage[] = (config.pages || ["Home"]).map((pageName) => ({
    id: uuid(),
    name: pageName,
    components: [
      {
        id: uuid(),
        type: "Frame",
        layout: { mode: "auto", autoLayout: { direction: "column", gap: 16 } },
        props: { base: { padding: 24 } },
        children: [
          {
            id: uuid(),
            type: "Text",
            layout: { mode: "relative" },
            props: { base: { text: `${pageName} Page`, fontSize: 32 } },
          },
        ],
      },
    ],
  }))

  return { pages }
}
// lib/ai/sectionGenerator.ts

import { BuilderComponent } from "@lib/exporter/schema"
import { v4 as uuid } from "uuid"

export function generateHeroSection(): BuilderComponent {
  return {
    id: uuid(),
    type: "Container",
    layout: { direction: "column", gap: 16 },
    children: [
      {
        id: uuid(),
        type: "Text",
        props: { text: "Your Powerful Headline", fontSize: 42 }
      },
      {
        id: uuid(),
        type: "Text",
        props: { text: "Subheading that explains the value.", fontSize: 18 }
      },
      {
        id: uuid(),
        type: "Container",
        layout: { direction: "row", gap: 12 },
        children: [
          {
            id: uuid(),
            type: "Button",
            props: { text: "Get Started" }
          },
          {
            id: uuid(),
            type: "Button",
            props: { text: "Learn More" }
          }
        ]
      }
    ]
  }
}

//
//  componentRegistry.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/18/26.
//


import { ComponentDefinition } from "../exporter/schema"

export const componentRegistry: Record<string, ComponentDefinition> = {
  Text: {
    type: "Text",
    props: {
      text: { type: "text", section: "Content" },
      fontSize: { type: "token-font", section: "Typography" },
      color: { type: "token-color", section: "Typography" },
      padding: { type: "spacing", section: "Spacing" },
    },
  },

  Container: {
    type: "Container",
    props: {
      direction: {
        type: "select",
        options: ["row", "column"],
        section: "Layout",
      },
      gap: { type: "spacing", section: "Spacing" },
    },
  },
}

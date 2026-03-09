//
//  componentSchemas.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/18/26.
//


import { designTokens } from "@/lib/design/tokens"

export type FieldType =
  | "text"
  | "number"
  | "boolean"
  | "select"
  | "spacing"
  | "token-color"
  | "token-font"

export type ComponentSchema = {
  sections: {
    label: string
    fields: {
      key: string
      label: string
      type: FieldType
      options?: string[]
    }[]
  }[]
}

export const componentSchemas: Record<string, ComponentSchema> = {
  Text: {
    sections: [
      {
        label: "Content",
        fields: [
          { key: "text", label: "Text", type: "text" },
        ],
      },
      {
        label: "Typography",
        fields: [
          { key: "fontSize", label: "Font Size", type: "token-font" },
          { key: "color", label: "Color", type: "token-color" },
        ],
      },
      {
        label: "Spacing",
        fields: [
          { key: "padding", label: "Padding", type: "spacing" },
          { key: "margin", label: "Margin", type: "spacing" },
        ],
      },
    ],
  },

  Container: {
    sections: [
      {
        label: "Layout",
        fields: [
          {
            key: "direction",
            label: "Direction",
            type: "select",
            options: ["row", "column"],
          },
        ],
      },
      {
        label: "Spacing",
        fields: [
          { key: "gap", label: "Gap", type: "spacing" },
          { key: "padding", label: "Padding", type: "spacing" },
        ],
      },
    ],
  },
}

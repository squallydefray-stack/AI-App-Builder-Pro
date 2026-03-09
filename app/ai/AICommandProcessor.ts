// app/ai/AICommandProcessor.ts

import { BuilderComponent } from "@lib/componentTypes"

export function processAICommand(prompt: string): BuilderComponent[] {
  return [
    {
      id: `section-${Date.now()}`,
      type: "Section",
      props: {
        padding: "80px 20px",
        backgroundColor: "#ffffff",
      },
      children: [
        {
          id: `container-${Date.now()}`,
          type: "Container",
          props: {
            maxWidth: "1200px",
            margin: "0 auto",
          },
          children: [
            {
              id: `heading-${Date.now()}`,
              type: "Text",
              props: {
                text: "AI Generated Section",
                fontSize: "32px",
                fontWeight: "bold",
              },
            },
            {
              id: `button-${Date.now()}`,
              type: "Button",
              props: {
                text: "Get Started",
              },
            },
          ],
        },
      ],
    },
  ]
}
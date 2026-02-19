//
//  landing.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/14/26.
//


import { BuilderPage } from "../state/builderStore"

export const landingTemplate: BuilderPage[] = [
  {
    id: "home",
    name: "Home",
    components: [
      {
        id: "hero",
        type: "Section",
        props: { padding: 8 },
        children: [
          {
            id: "title",
            type: "Text",
            props: {
              text: "Welcome to AI Builder",
              fontSize: "4xl",
              fontWeight: "bold"
            }
          },
          {
            id: "cta",
            type: "Button",
            props: {
              label: "Get Started",
              color: "blue"
            }
          }
        ]
      }
    ]
  }
]

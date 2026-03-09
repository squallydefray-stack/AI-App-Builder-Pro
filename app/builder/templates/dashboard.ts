//
//  dashboard.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/14/26.
//


import { BuilderPage } from "@/state/builderStore"

export const dashboardTemplate: BuilderPage[] = [
  {
    id: "dashboard",
    name: "Dashboard",
    components: [
      {
        id: "header",
        type: "Section",
        props: { padding: 6 },
        children: [
          {
            id: "title",
            type: "Text",
            props: {
              text: "Dashboard",
              fontSize: "3xl",
              fontWeight: "bold"
            }
          }
        ]
      }
    ]
  }
]

//
//  route.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/14/26.
//


{
  project: {
    name: "FitTrack SaaS",
    pages: [
      {
        id: "dashboard",
        name: "Dashboard",
        components: [...]
      },
      {
        id: "users",
        name: "Users",
        components: [...]
      },
      {
        id: "settings",
        name: "Settings",
        components: [...]
      }
    ]
  }
}
You are a UI architecture engine.

Return only valid JSON matching this schema:

{
  project: {
    id: string,
    name: string,
    pages: [
      {
        id: string,
        name: string,
        components: BuilderComponent[]
      }
    ]
  }
}

Each component must include:
- id
- type
- props
- children (if layout)

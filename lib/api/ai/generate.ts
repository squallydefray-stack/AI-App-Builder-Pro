//
//  generate.ts
//  AiAppBuilderPro
//
//  Created by Squally Da Boss on 2/8/26.
//


import { BuilderSchema } from "@/lib/exporter/schema"

export function generateSchema(prompt: string): BuilderSchema {
  return {
    pages: [
      {
        name: "Home",
        components: [{ id: "1", type: "Text", props: { text: prompt } }],
      },
    ],
  }
}

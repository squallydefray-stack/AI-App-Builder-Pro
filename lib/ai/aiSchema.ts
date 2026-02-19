//
//  aiSchema.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/12/26.
//


export type AINode = {
  id?: string
  type: "Container" | "Text" | "Button" | "Image"
  props?: Record<string, any>
  layout?: {
    direction?: "row" | "column"
    gap?: number
  }
  children?: AINode[]
}

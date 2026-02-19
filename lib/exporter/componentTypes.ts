//
//  componentTypes.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/14/26.
//


export type ComponentType =
  | "Text"
  | "Button"
  | "Container"
  | "Grid"
  | "Image"
  | "Input"
  | "Card"
  | "Section"
  | "Navbar"
  | "Footer"

export interface BuilderComponent {
  id: string
  type: ComponentType
  props: Record<string, any>
  children?: BuilderComponent[]
}

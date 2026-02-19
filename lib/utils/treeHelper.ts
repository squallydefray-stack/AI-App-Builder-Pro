
// lib/utils/treeHelper.ts
// AiAppBuilderPro
// Created by Squally Da Boss on 2/11/26

// lib/exporter/schema.ts

export type Breakpoint = "base" | "tablet" | "mobile"

export type ResponsiveProps = {
  base: Record<string, any>
  tablet?: Record<string, any>
  mobile?: Record<string, any>
}

export type BuilderComponent = {
  id: string
  type: "Layout" | "Text" | "Button" | "Input" | "Card" | "Form" | "Table"
  props: ResponsiveProps
  children?: BuilderComponent[]
}

export type PageSchema = {
  id: string
  name: string
  components: BuilderComponent[]
}

export type BuilderSchema = {
  pages: PageSchema[]
}

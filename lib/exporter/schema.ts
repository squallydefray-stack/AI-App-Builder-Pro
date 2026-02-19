/* ============================================================
   BREAKPOINT SYSTEM
============================================================ */

export type Breakpoint = "base" | "tablet" | "mobile"

export type ResponsiveProps = {
  base: Record<string, any>
  tablet?: Record<string, any>
  mobile?: Record<string, any>
}

/* ============================================================
   SIZE & CONSTRAINTS
============================================================ */

export type SizeMode = "fixed" | "hug" | "fill"

export type Constraint =
  | "left"
  | "right"
  | "top"
  | "bottom"
  | "center-x"
  | "center-y"
  | "stretch-x"
  | "stretch-y"

export interface Constraints {
  top?: boolean
  bottom?: boolean
  left?: boolean
  right?: boolean
  centerX?: boolean
  centerY?: boolean
}

/* ============================================================
   AUTO-LAYOUT
============================================================ */

export interface AutoLayoutConfig {
  enabled: boolean
  direction?: "row" | "column"
  gap?: number
  padding?: number
  justify?: "start" | "center" | "end" | "between"
  align?: "start" | "center" | "end" | "stretch"
}

/* ============================================================
   LAYOUT SYSTEM
============================================================ */

export interface LayoutConfig {
  display?: "flex" | "grid" | "absolute"
  direction?: "row" | "column"
  gap?: number
  justify?: string
  align?: string
  constraints?: Constraint[]
  autoLayout?: AutoLayoutConfig
  widthMode?: SizeMode
  heightMode?: SizeMode
}

/* ============================================================
   COMPONENT
============================================================ */

export interface BuilderComponent {
  id: string
  type: string
  parentId: string | null
  props: ResponsiveProps
  layout?: LayoutConfig
  constraints?: Constraints
  children?: BuilderComponent[]
}

/* ============================================================
   PAGE
============================================================ */

export interface BuilderPage {
  id: string
  name: string
  route: string
  components: BuilderComponent[]
}

/* ============================================================
   ROOT SCHEMA
============================================================ */

export interface BuilderSchema {
  version: "1.0.0"
  pages: BuilderPage[]
}

export type PropDefinition = {
  type:
    | "text"
    | "number"
    | "boolean"
    | "select"
    | "spacing"
    | "token-color"
    | "token-font"
  default?: any
  options?: string[]
  section?: string
}

export type ComponentDefinition = {
  type: string
  props: Record<string, PropDefinition>
}

export type ComponentVariant = {
  name: string
  props: Record<string, any>
}

export type BuilderComponent = {
  id: string
  type: string
  props: Record<string, any>
  variants?: ComponentVariant[]
  activeVariant?: string
}

layout?: {
  type: "flex" | "grid"
  direction?: "row" | "column"
  justify?: string
  align?: string
  gap?: number
}

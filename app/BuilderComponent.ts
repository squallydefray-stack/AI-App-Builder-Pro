export type Breakpoint = "base" | "mobile" | "tablet" | "desktop"

export type StyleProps = {
  x?: number
  y?: number
  width?: number | "hug" | "fill"
  height?: number | "hug" | "fill"
  backgroundColor?: string
  color?: string
  fontSize?: number
  borderRadius?: number
}

export type PropsPerBreakpoint = {
  [key in Breakpoint]?: StyleProps
}

/** Auto layout configuration for a component */
export type AutoLayoutConfig = {
  enabled: boolean
  direction: "row" | "column"
  gap?: number
  fillChildren?: boolean
  hugChildren?: boolean
  orientation?: "vertical" | "horizontal"  // NEW: allows explicit orientation
}

/** General layout config: absolute or auto layout */
export type LayoutConfig = {
  mode: "absolute" | "auto"
  autoLayout?: AutoLayoutConfig
}

/** Base component type */
export type BuilderComponent = {
  id: string
  type: "Box" | "Button" | "Input" | "Card" | "Text" | "Image" | "Repeater"
  props: Record<string, any>
  propsPerBreakpoint?: PropsPerBreakpoint
  style?: StyleProps
  position?: { x: number; y: number }
  layout?: LayoutConfig
  children?: BuilderComponent[]
  parentId?: string | null
}

export interface ResponsiveProps {
  base?: Record<string, any>
  sm?: Record<string, any>
  md?: Record<string, any>
  lg?: Record<string, any>
  xl?: Record<string, any>
}

export interface BuilderComponent {
  id: string
  type: ComponentType
  props: Record<string, any>
  responsive?: ResponsiveProps
  children?: BuilderComponent[]
}

export interface ResponsiveProps {
  base?: Record<string, any>
  sm?: Record<string, any>
  md?: Record<string, any>
  lg?: Record<string, any>
  xl?: Record<string, any>
}

export interface BuilderComponent {
  id: string
  type: ComponentType
  props: Record<string, any>
  responsive?: ResponsiveProps
  children?: BuilderComponent[]
}
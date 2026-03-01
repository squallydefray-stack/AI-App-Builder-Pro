// lib/utils/createBuilderComponent.ts

import { BuilderComponent } from "@lib/exporter/schema"

type PartialBuilderComponent = {
  id: string
  type: ComponentType
  children?: BuilderComponent[]
  parentId?: string | null
  propsPerBreakpoint?: any
  layout?: any
  constraints?: any
  props?: any
}

function getDefaultProps(type: ComponentType): any {
  switch (type) {
    case "Text":
      return { text: "Text", width: 200, height: 50 }
    case "Button":
      return { label: "Button", width: 120, height: 40 }
    case "Card":
      return { width: 250, height: 150 }
    case "Image":
      return { src: "", width: 200, height: 200 }
    case "Form":
      return { width: 300, height: 400 }
    case "Video":
      return { src: "", width: 400, height: 300 }
    default:
      return { width: 200, height: 100 }
  }
}

export function createBuilderComponent(
  input: PartialBuilderComponent,
  parentId?: string | null
): BuilderComponent {
  const defaults = getDefaultProps(input.type)

  return {
    id: input.id,
    type: input.type,
    parentId: parentId ?? input.parentId ?? null,
    propsPerBreakpoint: {
      base: { ...defaults },
      ...(input.propsPerBreakpoint || {}),
    },
    layout: input.layout || {
      mode: "absolute",
    },
    constraints: input.constraints || {},
    props: input.props || {},
    children: input.children || [],
  }
}

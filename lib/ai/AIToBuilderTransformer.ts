// lib/ai/AIToBuilderTransformer.ts

import { BuilderComponent, ComponentType } from "@/lib/componentTypes"

interface AIBlock {
  type: string
  props?: Record<string, unknown>
  children?: AIBlock[]
}

function normalizeType(type: string): ComponentType {
  const map: Record<string, ComponentType> = {
    text: "Text",
    button: "Button",
    container: "Container",
    grid: "Grid",
    image: "Image",
    input: "Input",
    card: "Card",
    section: "Section",
    navbar: "Navbar",
    footer: "Footer",
  }

  return map[type.toLowerCase()] ?? "Container"
}

export function transformAIToBuilder(blocks: AIBlock[]): BuilderComponent[] {
  return blocks.map((block) => ({
    id: `comp-${Date.now()}-${Math.random()}`,
    type: normalizeType(block.type),
    props: block.props ?? {},
    children: block.children
      ? transformAIToBuilder(block.children)
      : undefined,
  }))
}
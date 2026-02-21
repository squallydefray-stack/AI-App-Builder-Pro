//
//  generateComponentJSX.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/13/26.
//


import { BuilderComponent, Breakpoint } from "@lib/exporter/schema"

function mapStyleToTailwind(style: Record<string, any>): string {
  if (!style) return ""
  const classes: string[] = []

  // Example mappings
  if (style.padding) classes.push(`p-[${style.padding}]`)
  if (style.margin) classes.push(`m-[${style.margin}]`)
  if (style.width) classes.push(`w-[${style.width}]`)
  if (style.height) classes.push(`h-[${style.height}]`)
  if (style.flexDirection) classes.push(`flex-${style.flexDirection}`)
  if (style.justifyContent) classes.push(`justify-${style.justifyContent}`)
  if (style.alignItems) classes.push(`items-${style.alignItems}`)
  if (style.gap) classes.push(`gap-[${style.gap}]`)
  if (style.background) classes.push(`bg-[${style.background}]`)
  if (style.color) classes.push(`text-[${style.color}]`)
  if (style.fontSize) classes.push(`text-[${style.fontSize}]`)
  if (style.borderRadius) classes.push(`rounded-[${style.borderRadius}]`)

  return classes.join(" ")
}

export function generateComponentJSX(
  comp: BuilderComponent,
  breakpoint: Breakpoint = "desktop"
): string {
  const bpProps = comp.props?.[breakpoint] || {}
  const styleClass = mapStyleToTailwind(bpProps.style || {})

  const childrenJSX = (comp.children || [])
    .map((c) => generateComponentJSX(c, breakpoint))
    .join("\n")

  switch (comp.type) {
    case "Button":
      return `<button class="${styleClass}">${bpProps.text || "Button"}</button>`
    case "Text":
      return `<p class="${styleClass}">${bpProps.text || "Text"}</p>`
    case "Card":
    case "Layout":
      return `<div class="${styleClass}">${childrenJSX}</div>`
    case "Input":
      return `<input class="${styleClass}" placeholder="${bpProps.placeholder || ""}" />`
    default:
      return `<div class="${styleClass}">${childrenJSX}</div>`
  }
}

// lib/exporter/styleSerializer.ts
import { BuilderComponent, Breakpoint } from "@lib/exporter/schema"

export function serializeStyles(
  props: Record<string, any>,
  breakpoint: Breakpoint = "base"
) {
  const bpProps = props[breakpoint] || props.base || {}
  const classes: string[] = []

  // Dimensions
  if (bpProps.width !== undefined) classes.push(`w-[${bpProps.width}]`)
  if (bpProps.height !== undefined) classes.push(`h-[${bpProps.height}]`)

  // Positioning (absolute)
  if (bpProps.x !== undefined) classes.push(`left-[${bpProps.x}px] absolute`)
  if (bpProps.y !== undefined) classes.push(`top-[${bpProps.y}px] absolute`)

  // Background
  if (bpProps.bgColor) classes.push(`bg-[${bpProps.bgColor}]`)

  // Auto-layout
  if (bpProps.layout?.autoLayout?.enabled) {
    const { direction, gap, justify, align } = bpProps.layout.autoLayout

    classes.push(direction === "row" ? "flex flex-row" : "flex flex-col")
    if (gap !== undefined) classes.push(`gap-[${gap}px]`)

    if (justify) {
      const map: Record<string, string> = {
        start: "justify-start",
        center: "justify-center",
        end: "justify-end",
        between: "justify-between",
      }
      classes.push(map[justify] || "")
    }

    if (align) {
      const map: Record<string, string> = {
        start: "items-start",
        center: "items-center",
        end: "items-end",
        stretch: "items-stretch",
      }
      classes.push(map[align] || "")
    }
  }

  // Constraints (stretch)
  if (bpProps.constraints) {
    if (bpProps.constraints.stretchX) classes.push("w-full")
    if (bpProps.constraints.stretchY) classes.push("h-full")
  }

  return classes.join(" ")
}

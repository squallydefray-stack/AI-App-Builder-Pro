//
//  tailwindMapper.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/14/26.
//


import { ResponsiveProps } from "@/app/builder/state/builderStore"

export function mapPropsToTailwind(props: ResponsiveProps): string {
  const breakpoints = ["base", "tablet", "mobile"] as const
  const classes: string[] = []

  breakpoints.forEach((bp) => {
    const bpProps = props[bp]
    if (!bpProps) return

    // Layout
    if (bpProps.display) classes.push(`${bpPrefix(bp)}${bpProps.display}`)
    if (bpProps.flexDirection) classes.push(`${bpPrefix(bp)}flex-${bpProps.flexDirection}`)
    if (bpProps.justifyContent) classes.push(`${bpPrefix(bp)}justify-${bpProps.justifyContent}`)
    if (bpProps.alignItems) classes.push(`${bpPrefix(bp)}items-${bpProps.alignItems}`)

    // Spacing
    if (bpProps.margin) classes.push(`${bpPrefix(bp)}m-${bpProps.margin}`)
    if (bpProps.marginTop) classes.push(`${bpPrefix(bp)}mt-${bpProps.marginTop}`)
    if (bpProps.marginBottom) classes.push(`${bpPrefix(bp)}mb-${bpProps.marginBottom}`)
    if (bpProps.marginLeft) classes.push(`${bpPrefix(bp)}ml-${bpProps.marginLeft}`)
    if (bpProps.marginRight) classes.push(`${bpPrefix(bp)}mr-${bpProps.marginRight}`)
    if (bpProps.padding) classes.push(`${bpPrefix(bp)}p-${bpProps.padding}`)
    if (bpProps.paddingTop) classes.push(`${bpPrefix(bp)}pt-${bpProps.paddingTop}`)
    if (bpProps.paddingBottom) classes.push(`${bpPrefix(bp)}pb-${bpProps.paddingBottom}`)
    if (bpProps.paddingLeft) classes.push(`${bpPrefix(bp)}pl-${bpProps.paddingLeft}`)
    if (bpProps.paddingRight) classes.push(`${bpPrefix(bp)}pr-${bpProps.paddingRight}`)

    // Width / Height
    if (bpProps.width) classes.push(`${bpPrefix(bp)}w-${bpProps.width}`)
    if (bpProps.height) classes.push(`${bpPrefix(bp)}h-${bpProps.height}`)

    // Background / Text
    if (bpProps.bgColor) classes.push(`${bpPrefix(bp)}bg-${bpProps.bgColor}`)
    if (bpProps.textColor) classes.push(`${bpPrefix(bp)}text-${bpProps.textColor}`)
        if (bpProps.border) classes.push(`${bpPrefix(bp)}border-${bpProps.border}`)
        if (bpProps.rounded) classes.push(`${bpPrefix(bp)}rounded-${bpProps.rounded}`)
        if (bpProps.shadow) classes.push(`${bpPrefix(bp)}shadow-${bpProps.shadow}`)

        if (bpProps.textAlign) classes.push(`${bpPrefix(bp)}text-${bpProps.textAlign}`)

        if (bpProps.imageFit) classes.push(`${bpPrefix(bp)}object-${bpProps.imageFit}`)
        if (bpProps.imageRound) classes.push(`${bpPrefix(bp)}rounded-${bpProps.imageRound}`)
  })

  return classes.join(" ")
}

function bpPrefix(bp: typeof bp): string {
  switch (bp) {
    case "base":
      return ""
    case "tablet":
      return "md:"
    case "mobile":
      return "sm:"
  }
}

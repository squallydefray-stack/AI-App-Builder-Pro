//
//  styleToTailwind.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/13/26.
//


// Convert simple CSS style object into Tailwind classes
export function styleToTailwind(style: Record<string, any>) {
  if (!style) return ""

  const classes: string[] = []

  for (const [key, value] of Object.entries(style)) {
    switch (key) {
      case "padding":
        classes.push(`p-[${value}]`)
        break
      case "margin":
        classes.push(`m-[${value}]`)
        break
      case "width":
        classes.push(`w-[${value}]`)
        break
      case "height":
        classes.push(`h-[${value}]`)
        break
      case "background":
        classes.push(`bg-[${value}]`)
        break
      case "color":
        classes.push(`text-[${value}]`)
        break
      case "fontSize":
        classes.push(`text-[${value}]`)
        break
      case "borderRadius":
        classes.push(`rounded-[${value}]`)
        break
      case "display":
        if (value === "flex") classes.push("flex")
        break
      case "flexDirection":
        if (value === "row") classes.push("flex-row")
        if (value === "column") classes.push("flex-col")
        break
      case "justifyContent":
        classes.push(`justify-${value}`)
        break
      case "alignItems":
        classes.push(`items-${value}`)
        break
      case "gap":
        classes.push(`gap-[${value}]`)
        break
      default:
        break
    }
  }

  return classes.join(" ")
}

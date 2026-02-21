// lib/ai/styleAssistant.ts
// AI App Builder Pro
// Production AI style suggestion engine

import { BuilderComponent } from "@lib/exporter/schema"

export type Breakpoint = "desktop" | "tablet" | "mobile"

export type StyleSuggestion = Record<string, string>

export async function suggestStyles(
  component: BuilderComponent,
  breakpoint: Breakpoint
): Promise<StyleSuggestion> {
  try {
    const response = await fetch("/api/ai/style", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: component.type,
        props: component.props?.[breakpoint] || {},
        breakpoint,
      }),
    })

    if (!response.ok) {
      throw new Error("AI style request failed")
    }

    const data = await response.json()

    // Ensure we only return safe CSS properties
    return sanitizeStyles(data.styles)

  } catch (error) {
    console.error("Style AI Error:", error)
    return {}
  }
}


/**
 * Only allow valid CSS style keys.
 * Prevents AI from injecting invalid or dangerous values.
 */
function sanitizeStyles(styles: Record<string, any>): StyleSuggestion {
  const allowedKeys = [
    "padding",
    "margin",
    "width",
    "height",
    "background",
    "backgroundColor",
    "color",
    "fontSize",
    "fontWeight",
    "border",
    "borderRadius",
    "display",
    "flexDirection",
    "justifyContent",
    "alignItems",
    "gap",
  ]

  const safe: StyleSuggestion = {}

  for (const key of Object.keys(styles || {})) {
    if (allowedKeys.includes(key)) {
      safe[key] = String(styles[key])
    }
  }

  return safe
}

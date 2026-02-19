//
//  propSuggestions.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/18/26.
//


export function suggestProps(component: any) {
  const suggestions: Record<string, any> = {}

  if (component.type === "Text") {
    if (!component.props?.base?.fontSize) {
      suggestions.fontSize = "lg"
    }

    if (!component.props?.base?.color) {
      suggestions.color = "text"
    }
  }

  if (component.type === "Container") {
    if (!component.props?.base?.gap) {
      suggestions.gap = 16
    }
  }

  return suggestions
}

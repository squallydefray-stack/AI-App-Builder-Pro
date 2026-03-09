//
//  variableParser.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/25/26.
//


export function parseDynamicText(value: string): string {
  const regex = /\{\{(.*?)\}\}/g

  if (!regex.test(value)) {
    return JSON.stringify(value)
  }

  return value.replace(regex, (_, expression) => {
    return `\${${expression.trim()}}`
  })
}
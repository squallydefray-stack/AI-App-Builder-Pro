import React from "react"

export function resolveStyleWithInheritance(
  ownStyle: React.CSSProperties = {},
  inheritedStyle: React.CSSProperties = {}
) {
  const resolved: React.CSSProperties = {}
  const ghostedKeys = new Set<string>()

  Object.entries(inheritedStyle).forEach(([key, value]) => {
    if (!(key in ownStyle)) {
      resolved[key as any] = value
      ghostedKeys.add(key)
    }
  })

  Object.entries(ownStyle).forEach(([key, value]) => {
    resolved[key as any] = value
  })

  return { resolvedStyle: resolved, ghostedKeys }
}

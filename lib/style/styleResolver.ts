//
//  styleResolver.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/18/26.
//


export function resolveStyles(component: any, parent: any, breakpoint: string) {
  const own = component.props?.[breakpoint] || {}
  const inherited = parent?.computedStyles || {}

  return {
    ...inherited,
    ...own,
  }
}

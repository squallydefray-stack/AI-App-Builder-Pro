//
//  variantResolver.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/18/26.
//


export function resolveVariant(component: any) {
  if (!component.variants || !component.activeVariant)
    return component.props

  const variant = component.variants.find(
    (v: any) => v.name === component.activeVariant
  )

  return {
    ...component.props,
    ...variant?.props,
  }
}

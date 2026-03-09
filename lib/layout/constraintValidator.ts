// lib/layout/constraintValidator.ts
// Ultra Platinum Constraint Validator

import { BuilderComponent } from "@lib/exporter/schema"

export type ConstraintIssue = {
  componentId: string
  message: string
}

export function validateConstraints(
  component: BuilderComponent
): ConstraintIssue[] {
  const issues: ConstraintIssue[] = []
  const c = component.layout?.constraints ?? []

  const hasLeft = c.includes("left")
  const hasRight = c.includes("right")
  const hasCenterX = c.includes("center-x")

  if (hasLeft && hasRight && hasCenterX) {
    issues.push({
      componentId: component.id,
      message:
        "Invalid constraint: cannot combine left + right + center-x",
    })
  }

  const hasTop = c.includes("top")
  const hasBottom = c.includes("bottom")
  const hasCenterY = c.includes("center-y")

  if (hasTop && hasBottom && hasCenterY) {
    issues.push({
      componentId: component.id,
      message:
        "Invalid constraint: cannot combine top + bottom + center-y",
    })
  }

  return issues
}

import { BuilderComponent } from "../exporter/schema"

export function applyConstraints(
  parent: BuilderComponent
): BuilderComponent {

  if (!parent.children) return parent

  const parentWidth = parseInt(parent.responsiveProps.base.width || "0")
  const parentHeight = parseInt(parent.responsiveProps.base.height || "0")

  parent.children = parent.children.map(child => {
    const constraints = child.layout?.constraints || []

    let width = parseInt(child.responsiveProps.base.width || "0")
    let height = parseInt(child.responsiveProps.base.height || "0")

    if (constraints.includes("stretch-x")) {
      width = parentWidth
      child.responsiveProps.base.width = parentWidth + "px"
    }

    if (constraints.includes("stretch-y")) {
      height = parentHeight
      child.responsiveProps.base.height = parentHeight + "px"
    }

    if (constraints.includes("center-x")) {
      child.responsiveProps.base.margin = "0 auto"
    }

    if (constraints.includes("center-y")) {
      child.responsiveProps.base.display = "flex"
      child.responsiveProps.base.alignItems = "center"
    }

    return child
  })

  return parent
}

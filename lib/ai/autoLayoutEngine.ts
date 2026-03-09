import { BuilderComponent } from "@lib/exporter/schema"

export function applyAutoLayout(container: BuilderComponent) {
  if (!container.children || !container.layout?.autoLayout?.enabled) {
    return container
  }

  const { direction = "column", gap = 0, padding = 0 } =
    container.layout.autoLayout

  container.responsiveProps.base.display = "flex"
  container.responsiveProps.base.flexDirection = direction
  container.responsiveProps.base.gap = gap + "px"
  container.responsiveProps.base.padding = padding + "px"

  container.children = container.children.map(child => {
    const widthMode = child.layout?.widthMode || "fixed"
    const heightMode = child.layout?.heightMode || "fixed"

    if (widthMode === "fill") {
      child.responsiveProps.base.width = "100%"
    }

    if (heightMode === "fill") {
      child.responsiveProps.base.height = "100%"
    }

    if (widthMode === "hug") {
      delete child.responsiveProps.base.width
    }

    if (heightMode === "hug") {
      delete child.responsiveProps.base.height
    }

    return child
  })

  return container
}

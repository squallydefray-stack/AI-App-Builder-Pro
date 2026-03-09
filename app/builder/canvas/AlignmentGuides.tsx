// lib/snap/snapEngine.ts
"use client"

import { BuilderComponent, Breakpoint } from "@lib/exporter/schema"

/* ============================= */
/* Types */
/* ============================= */

// Export SnapSource for other pages
export type SnapSource =
  | "grid"
  | "parent"
  | "snap"
  | "component"
  | "element"
  | "center"

// SnapGuide represents a visual alignment guide
export interface SnapGuide {
  type: "vertical" | "horizontal"
  position: number
  source: SnapSource
}

// SnapLine for internal snapping calculation
export interface SnapLine {
  x?: number
  y?: number
}

/* ============================= */
/* Helpers */
/* ============================= */

function getResponsiveProps(comp: BuilderComponent, bp: Breakpoint) {
  return comp.propsPerBreakpoint?.[bp] || comp.props || {}
}

function isAutoLayoutControlled(component: BuilderComponent): boolean {
  return component.layout?.autoLayout?.enabled === true
}

/* ============================= */
/* Calculate Snap Lines (internal) */
/* ============================= */

export function calculateSnapLines(
  movingComp: BuilderComponent,
  staticComps: BuilderComponent[],
  breakpoint: Breakpoint,
  threshold: number = 8
): SnapLine[] {
  const snaps: SnapLine[] = []
  const movingProps = getResponsiveProps(movingComp, breakpoint)

  if (
    movingProps.x == null ||
    movingProps.y == null ||
    movingProps.width == null ||
    movingProps.height == null
  ) return snaps

  const movingLeft = movingProps.x
  const movingRight = movingProps.x + movingProps.width
  const movingTop = movingProps.y
  const movingBottom = movingProps.y + movingProps.height
  const movingCenterX = movingProps.x + movingProps.width / 2
  const movingCenterY = movingProps.y + movingProps.height / 2

  staticComps.forEach((comp) => {
    if (comp.id === movingComp.id) return
    if (isAutoLayoutControlled(comp)) return

    const props = getResponsiveProps(comp, breakpoint)
    if (
      props.x == null ||
      props.y == null ||
      props.width == null ||
      props.height == null
    )
      return

    const left = props.x
    const right = props.x + props.width
    const top = props.y
    const bottom = props.y + props.height
    const centerX = props.x + props.width / 2
    const centerY = props.y + props.height / 2

    if (Math.abs(movingLeft - left) <= threshold) snaps.push({ x: left })
    if (Math.abs(movingRight - right) <= threshold) snaps.push({ x: right })
    if (Math.abs(movingTop - top) <= threshold) snaps.push({ y: top })
    if (Math.abs(movingBottom - bottom) <= threshold) snaps.push({ y: bottom })
    if (Math.abs(movingCenterX - centerX) <= threshold) snaps.push({ x: centerX })
    if (Math.abs(movingCenterY - centerY) <= threshold) snaps.push({ y: centerY })
  })

  return snaps
}

/* ============================= */
/* Unified Snap + Guide Generation */
/* ============================= */

export function snapAndGenerateGuides(
  component: BuilderComponent,
  allComponents: BuilderComponent[],
  breakpoint: Breakpoint,
  threshold: number = 8,
  gridSize: number = 8,
  gridEnabled: boolean = true
): { snapped: BuilderComponent; guides: SnapGuide[] } {
  if (isAutoLayoutControlled(component))
    return { snapped: component, guides: [] }

  const props = getResponsiveProps(component, breakpoint)
  let x = props.x ?? 0
  let y = props.y ?? 0
  const width = props.width ?? 0
  const height = props.height ?? 0

  const guides: SnapGuide[] = []

  // ---- Grid snapping + guides ----
  if (gridEnabled) {
    const gridX = Math.round(x / gridSize) * gridSize
    const gridY = Math.round(y / gridSize) * gridSize

    if (Math.abs(x - gridX) <= threshold) {
      x = gridX
      guides.push({ type: "vertical", position: gridX, source: "grid" })
    }

    if (Math.abs(y - gridY) <= threshold) {
      y = gridY
      guides.push({ type: "horizontal", position: gridY, source: "grid" })
    }
  }

  // ---- Component snapping + guides ----
  const snaps = calculateSnapLines(component, allComponents, breakpoint, threshold)
  snaps.forEach((s) => {
    if (s.x != null && Math.abs(x - s.x) <= threshold) {
      x = s.x
      guides.push({ type: "vertical", position: s.x, source: "component" })
    }
    if (s.y != null && Math.abs(y - s.y) <= threshold) {
      y = s.y
      guides.push({ type: "horizontal", position: s.y, source: "component" })
    }
  })

  // ---- Center guides ----
  const centerX = x + width / 2
  const centerY = y + height / 2
  allComponents.forEach((other) => {
    if (other.id === component.id) return
    const op = getResponsiveProps(other, breakpoint)
    const otherCenterX = (op.x ?? 0) + (op.width ?? 0) / 2
    const otherCenterY = (op.y ?? 0) + (op.height ?? 0) / 2

    if (Math.abs(centerX - otherCenterX) <= threshold)
      guides.push({ type: "vertical", position: otherCenterX, source: "center" })
    if (Math.abs(centerY - otherCenterY) <= threshold)
      guides.push({ type: "horizontal", position: otherCenterY, source: "center" })
  })

  // ---- Parent bounds guides ----
  if (component.parentId) {
    const parent = allComponents.find((c) => c.id === component.parentId)
    if (parent) {
      const pp = getResponsiveProps(parent, breakpoint)
      const parentX = pp.x ?? 0
      const parentY = pp.y ?? 0
      const parentWidth = pp.width ?? 0
      const parentHeight = pp.height ?? 0

      if (Math.abs(x - parentX) <= threshold)
        guides.push({ type: "vertical", position: parentX, source: "parent" })
      if (Math.abs(x + width - (parentX + parentWidth)) <= threshold)
        guides.push({ type: "vertical", position: parentX + parentWidth, source: "parent" })
      if (Math.abs(y - parentY) <= threshold)
        guides.push({ type: "horizontal", position: parentY, source: "parent" })
      if (Math.abs(y + height - (parentY + parentHeight)) <= threshold)
        guides.push({ type: "horizontal", position: parentY + parentHeight, source: "parent" })
    }
  }

  const snapped: BuilderComponent = {
    ...component,
    propsPerBreakpoint: {
      ...component.propsPerBreakpoint,
      [breakpoint]: { ...props, x, y },
    },
  }

  return { snapped, guides }
}
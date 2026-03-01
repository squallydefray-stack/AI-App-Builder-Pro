"use client"

import { BuilderComponent, Breakpoint } from "@lib/exporter/schema"

/* ============================= */
/* Types */

export interface SnapLine {
  x?: number
  y?: number
  source: "grid" | "parent" | "snap" | "component"
}

export interface SnapGuide {
  type: "vertical" | "horizontal"
  position: number
}

/* Helpers */

function getResponsiveProps(
  comp: BuilderComponent,
  bp: Breakpoint
) {
  return (
 comp.propsPerBreakpoint?.[bp] ??
 comp.propsPerBreakpoint?.base ??
 {}
  )
}

function isAutoLayoutControlled(
  component: BuilderComponent
): boolean {
  return component.layout?.autoLayout?.enabled === true
}

/* SNAP CALCULATION */

export function calculateSnapLines(
  movingComp: BuilderComponent,
  staticComps: BuilderComponent[],
  breakpoint: Breakpoint,
  threshold = 8,
  parentBounds?: { width: number; height: number },
  gridEnabled = true
): SnapLine[] {
  const snaps: SnapLine[] = []
  const moving = getResponsiveProps(movingComp, breakpoint)

  if (
 moving.x == null ||
 moving.y == null ||
 moving.width == null ||
 moving.height == null
  ) {
 return snaps
  }

  const left = moving.x
  const right = moving.x + moving.width
  const top = moving.y
  const bottom = moving.y + moving.height
  const centerX = moving.x + moving.width / 2
  const centerY = moving.y + moving.height / 2

  /* ---------- GRID ---------- */
  if (gridEnabled) {
 const gridX = Math.round(left / threshold) * threshold
 const gridY = Math.round(top / threshold) * threshold

 if (Math.abs(left - gridX) <= threshold)
 snaps.push({ x: gridX, source: "grid" })

 if (Math.abs(top - gridY) <= threshold)
 snaps.push({ y: gridY, source: "grid" })
  }

  /* ---------- COMPONENT ---------- */
  staticComps.forEach((comp) => {
 if (comp.id === movingComp.id) return
 if (isAutoLayoutControlled(comp)) return

 const other = getResponsiveProps(comp, breakpoint)

 if (
 other.x == null ||
 other.y == null ||
 other.width == null ||
 other.height == null
 ) {
 return
 }

 const oLeft = other.x
 const oRight = other.x + other.width
 const oTop = other.y
 const oBottom = other.y + other.height
 const oCenterX = other.x + other.width / 2
 const oCenterY = other.y + other.height / 2

 if (Math.abs(left - oLeft) <= threshold)
 snaps.push({ x: oLeft, source: "component" })

 if (Math.abs(right - oRight) <= threshold)
 snaps.push({ x: oRight, source: "component" })

 if (Math.abs(top - oTop) <= threshold)
 snaps.push({ y: oTop, source: "component" })

 if (Math.abs(bottom - oBottom) <= threshold)
 snaps.push({ y: oBottom, source: "component" })

 /* Center snapping */
 if (Math.abs(centerX - oCenterX) <= threshold)
 snaps.push({ x: oCenterX, source: "snap" })

 if (Math.abs(centerY - oCenterY) <= threshold)
 snaps.push({ y: oCenterY, source: "snap" })
  })

  /* ---------- PARENT ---------- */
  if (parentBounds) {
 const parentCenterX = parentBounds.width / 2
 const parentCenterY = parentBounds.height / 2

 if (Math.abs(left) <= threshold)
 snaps.push({ x: 0, source: "parent" })

 if (Math.abs(top) <= threshold)
 snaps.push({ y: 0, source: "parent" })

 if (Math.abs(centerX - parentCenterX) <= threshold)
 snaps.push({ x: parentCenterX, source: "parent" })

 if (Math.abs(centerY - parentCenterY) <= threshold)
 snaps.push({ y: parentCenterY, source: "parent" })
  }

}

/* APPLY SNAP */

export function applySnapToComponents(
  component: BuilderComponent,
  allComponents: BuilderComponent[],
): BuilderComponent {
  if (isAutoLayoutControlled(component)) {
 return component
  }

  const props = getResponsiveProps(component, breakpoint)

  let x = props.x ?? 0
  let y = props.y ?? 0

  const snapLines = calculateSnapLines(
 component,
 allComponents,
 breakpoint,
 threshold,
 parentBounds,
 gridEnabled
  )

  snapLines.forEach((snap) => {
 if (snap.x != null) x = snap.x
 if (snap.y != null) y = snap.y
  })

  return {
 ...component,
 propsPerBreakpoint: {
 ...component.propsPerBreakpoint,
 [breakpoint]: {
 ...props,
 x,
 y,
 },
 },
  }
}

/* =========================================
   GENERATE SNAP / ALIGNMENT GUIDES
========================================= */
export function generateSnapGuides(
): SnapGuide[] {
 const lines = calculateSnapLines(
 component,
 threshold,
 )
  const guides: SnapGuide[] = []
  const props = component.propsPerBreakpoint[breakpoint] || component.propsPerBreakpoint.base || {}
  const x = props.x ?? 0
  const y = props.y ?? 0

  allComponents.forEach((other) => {
 if (other.id === component.id) return
 const otherProps = other.propsPerBreakpoint[breakpoint] || other.propsPerBreakpoint.base || {}
 // Horizontal alignment
 if (Math.abs(x - (otherProps.x ?? 0)) < 8) {
 guides.push({ axis: "x", value: otherProps.x ?? 0 })
 }
 // Vertical alignment
 if (Math.abs(y - (otherProps.y ?? 0)) < 8) {
 guides.push({ axis: "y", value: otherProps.y ?? 0 })
 }
  })
 return lines.map((line) => ({
 type: line.x != null ? "vertical" : "horizontal",
 position: line.x ?? line.y ?? 0,
 source: line.source,
 }))
  }

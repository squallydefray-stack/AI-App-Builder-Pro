// lib/layout/masterLayoutCompiler.ts
"use client"

import { BuilderComponent, Breakpoint } from "@lib/exporter/schema"

/**
 * Compile a structured plan for a page or component tree
 * into a layout-aware, responsive plan with constraints and auto-layout applied.
 */
export function compileStructuredPlan(
  component: BuilderComponent,
  breakpoints: Breakpoint[] = ["base", "tablet", "mobile"]
): BuilderComponent {
  // Ensure propsPerBreakpoint exists
  if (!component.propsPerBreakpoint) {
    component.propsPerBreakpoint = {}
    breakpoints.forEach((bp) => {
      component.propsPerBreakpoint![bp] = { ...(component.props || {}) }
    })
  }

  // Apply defaults per component type
  breakpoints.forEach((bp) => {
    const props = component.propsPerBreakpoint![bp]
    switch (component.type) {
      case "Container":
        props.display = props.display || "flex"
        props.direction = props.direction || "column"
        props.justify = props.justify || "flex-start"
        props.align = props.align || "flex-start"
        props.gap = props.gap ?? 8
        props.autoLayout = props.autoLayout ?? true
        break
      case "Text":
        props.fontSize = props.fontSize ?? 16
        props.color = props.color ?? "#000000"
        break
      case "Button":
        props.width = props.width ?? 120
        props.height = props.height ?? 40
        props.background = props.background ?? "#0070f4"
        props.color = props.color ?? "#ffffff"
        break
      case "Image":
        props.width = props.width ?? 200
        props.height = props.height ?? 150
        props.objectFit = props.objectFit ?? "cover"
        break
      case "Video":
        props.width = props.width ?? 400
        props.height = props.height ?? 225
      case "Form":
        props.width = props.width ?? 300
        props.height = props.height ?? 400
        break
      case "Card":
        props.width = props.width ?? 250
        props.height = props.height ?? 350
        props.borderRadius = props.borderRadius ?? 12
        props.shadow = props.shadow ?? "0 4px 12px rgba(0,0,0,0.1)"
        break
      default:
        props.width = props.width ?? 200
        props.height = props.height ?? 100
    }
    component.propsPerBreakpoint![bp] = props
  })

  // Recursively compile children
  if (component.children && component.children.length > 0) {
    component.children = component.children.map((child) =>
      compileStructuredPlan(child, breakpoints)
    )
  }

  return component
}

/**
 * Apply auto-layout constraints for flex/grid behavior.
 * Modifies children positions if autoLayout is true.
 */
export function applyConstraints(
  component: BuilderComponent,
  breakpoint: Breakpoint
): BuilderComponent {
  const props = component.propsPerBreakpoint?.[breakpoint] || component.props || {}

  if (props.autoLayout && component.children && component.children.length > 0) {
    let offset = 0
    const gap = props.gap ?? 8
    component.children.forEach((child) => {
      const childProps = child.propsPerBreakpoint?.[breakpoint] || child.props || {}
      if (props.direction === "column") {
        childProps.x = props.x ?? 0
        childProps.y = (props.y ?? 0) + offset
        offset += (childProps.height ?? 100) + gap
      } else {
        childProps.x = (props.x ?? 0) + offset
        childProps.y = props.y ?? 0
        offset += (childProps.width ?? 100) + gap
      }
      child.propsPerBreakpoint = {
        ...child.propsPerBreakpoint,
        [breakpoint]: childProps,
      }

      // Recursively apply constraints to nested children
      applyConstraints(child, breakpoint)
    })
  }

  return component
}

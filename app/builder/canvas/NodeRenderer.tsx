// app/builder/canvas/NodeRenderer.tsx
"use client"

import React from "react"
import { motion } from "framer-motion"
import { BuilderComponent } from "@lib/exporter/schema"

interface NodeRendererProps {
  component: BuilderComponent
    breakpoint: Breakpoint
    animate?: boolean
}

export const NodeRenderer: React.FC<NodeRendererProps> = ({
  component,
  breakpoint,
  animate = false,
}) => {
  const {
    id,
    type,
    children = [],
    propsPerBreakpoint,
  } = component

  const baseStyle = propsPerBreakpoint?.[breakpoint] ?? propsPerBreakpoint?.base ??
  {}

  const style: React.CSSProperties = {
    position: component.layout?.mode === "absolute" ? "absolute" : "relative",
    left: baseStyle.x,
    top: baseStyle.y,
    width: baseStyle.width,
    height: baseStyle.height,
    backgroundColor: baseStyle.backgroundColor,
    color: baseStyle.color,
    fontSize: baseStyle.fontSize,
    borderRadius: baseStyle.borderRadius,
  }

  const content =
    type === "Text"
      ? component.props?.text || "Text"
      : null

  const Wrapper = animate ? motion.div : "div"

  return (
    <Wrapper
      key={id}
      layout={animate}
      style={style}
      initial={animate ? { opacity: 0 } : undefined}
      animate={animate ? { opacity: 1 } : undefined}
      transition={{ duration: 0.15 }}
    >
      {content}

     {children?.map((child) => (
  <NodeRenderer
    key={child.id}
    component={child}
    breakpoint={breakpoint}
    animate={animate}
  />
))}    </Wrapper>
  )
}

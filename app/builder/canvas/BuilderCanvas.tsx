"use client"

import React from "react"
import { DndContext } from "@dnd-kit/core"
import { BuilderComponent, BuilderPage, Breakpoint } from "@lib/exporter/schema"
import {
  applyLayoutTree,
  applySnapToComponents,
  generateSnapGuides,
  SnapGuide,
} from "@/builder/lib/layoutUtils"
import { NodeRenderer } from "@/builder/canvas/NodeRenderer"

interface BuilderCanvasProps {
  page: BuilderPage
  activeBreakpoint: Breakpoint
  sensors?: any[]
  multiSelect?: boolean
}

export function BuilderCanvas({
  page,
  activeBreakpoint,
  sensors = [],
}: BuilderCanvasProps) {
  return (
    <div className="relative bg-white border rounded min-h-[800px]">
      <DndContext sensors={sensors}>
        {page.components.map((component) => {
          const laidOut = applyLayoutTree(component, activeBreakpoint)
          const snapped = applySnapToComponents(
            laidOut,
            page.components,
            activeBreakpoint
          )
          const guides: SnapGuide[] = generateSnapGuides(
            snapped,
            page.components,
            activeBreakpoint
          )

          return (
            <React.Fragment key={component.id}>
              <NodeRenderer
                component={snapped}
                breakpoint={activeBreakpoint}
              />

              {guides.map((guide, i) =>
                guide.axis === "x" ? (
                  <div
                    key={`x-${i}`}
                    className="absolute top-0 bottom-0 w-px bg-blue-400 pointer-events-none"
                    style={{ left: guide.value }}
                  />
                ) : (
                  <div
                    key={`y-${i}`}
                    className="absolute left-0 right-0 h-px bg-blue-400 pointer-events-none"
                    style={{ top: guide.value }}
                  />
                )
              )}
            </React.Fragment>
          )
        })}
      </DndContext>
    </div>
  )
}
// UltraPlatinumEditor.tsx
// AI-App-Builder-Pro — Ultra Platinum Editor
// Created by Squally Da Boss on 2/24/26

"use client"

import React, { useEffect, useState } from "react"
import { useBuilderStore } from "@/builder/state/builderStore"
import { BuilderComponent, Breakpoint } from "@/lib/exporter/schema"
import { NodeRenderer } from "@/builder/components/NodeRenderer"
import { exportToReact } from "@lib/exporter/realExporter"
import {
  applySnapToComponents,
  applyLayoutTree,
  generateSnapGuides,
  SnapGuide,
} from "@/ib/layout/masterLayoutCompiler"
import update from "immutability-helper"

export default function UltraPlatinumEditor() {
  const pages = useBuilderStore((s) => s.pages)
  const activePageId = useBuilderStore((s) => s.activePageId)
  const activeBreakpoint = useBuilderStore((s) => s.activeBreakpoint)
  const addComponentsTransactional = useBuilderStore((s) => s.addComponentsTransactional)
  const updateMultipleComponents = useBuilderStore((s) => s.updateMultipleComponents)
  const setSelectedIds = useBuilderStore((s) => s.setSelectedIds)
  const setActiveBreakpoint = useBuilderStore((s) => s.setActiveBreakpoint)
  const gridEnabled = useBuilderStore((s) => s.gridEnabled)
  const toggleGrid = useBuilderStore((s) => s.toggleGrid)
  const gridSize = useBuilderStore((s) => s.gridSize)
  const setGridSize = useBuilderStore((s) => s.setGridSize)
  const selectedIds = useBuilderStore((s) => s.selectedIds)

  const [liveComponents, setLiveComponents] = useState<BuilderComponent[]>([])
  const [code, setCode] = useState("")
  const [guides, setGuides] = useState<SnapGuide[]>([])

  const activePage = pages.find((p) => p.id === activePageId)
  const activeComponent = liveComponents.find((c) => selectedIds.includes(c.id))

  /** ----- Load active page components ----- */
  useEffect(() => {
    if (!activePage) return
    setLiveComponents(activePage.components)
  }, [activePage])

  /** ----- Live JSX Export ----- */
  useEffect(() => {
    const newCode = exportToReact(liveComponents, activeBreakpoint)
    setCode(newCode)
  }, [liveComponents, activeBreakpoint])

  /** ----- Prop Change with Snap & Auto-Layout ----- */
  const handlePropChange = (prop: string, value: any) => {
    if (!activeComponent) return

    const updated: BuilderComponent = {
      ...activeComponent,
      propsPerBreakpoint: {
        ...activeComponent.propsPerBreakpoint,
        [activeBreakpoint]: {
          ...activeComponent.propsPerBreakpoint[activeBreakpoint],
          [prop]: value,
        },
      },
    }

    const updatedComponents = liveComponents.map((c) =>
      c.id === activeComponent.id ? updated : c
    )

    // Apply snapping & auto-layout
    const snappedComponents = updatedComponents.map((c) =>
      applySnapToComponents(c, updatedComponents, activeBreakpoint)
    )
    const laidOut = snappedComponents.map((c) => applyLayoutTree(c, activeBreakpoint))
    setLiveComponents(laidOut)

    // Generate guides
    const newGuides = generateSnapGuides(activeComponent, laidOut, activeBreakpoint)
    setGuides(newGuides)

    // Update store
    updateMultipleComponents(
      laidOut.map((c) => ({
        id: c.id,
        props: c.propsPerBreakpoint[activeBreakpoint],
      }))
    )
  }

  /** ----- Drag & Drop ----- */
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.dataTransfer.setData("text/plain", index.toString())
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault()
    const dragIndex = Number(e.dataTransfer.getData("text/plain"))
    if (isNaN(dragIndex)) return

    const reordered = update(liveComponents, {
      $splice: [
        [dragIndex, 1],
        [dropIndex, 0, liveComponents[dragIndex]],
      ],
    })

    const snapped = reordered.map((c) =>
      applySnapToComponents(c, reordered, activeBreakpoint)
    )
    const laidOut = snapped.map((c) => applyLayoutTree(c, activeBreakpoint))

    setLiveComponents(laidOut)
    updateMultipleComponents(
      laidOut.map((c) => ({
        id: c.id,
        props: c.propsPerBreakpoint[activeBreakpoint],
      }))
    )
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault()
  const handleApplyCode = () => addComponentsTransactional(liveComponents)

  /** ----- Grid overlay positions ----- */
  const gridLines: JSX.Element[] = []
  if (gridEnabled) {
    const cols = Math.floor(1200 / gridSize)
    const rows = Math.floor(800 / gridSize)
    for (let i = 1; i <= cols; i++) {
      gridLines.push(
        <div
          key={`v${i}`}
          style={{
            position: "absolute",
            top: 0,
            left: i * gridSize,
            width: 1,
            height: "100%",
            background: "rgba(0,0,0,0.1)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
      )
    }
    for (let j = 1; j <= rows; j++) {
      gridLines.push(
        <div
          key={`h${j}`}
          style={{
            position: "absolute",
            left: 0,
            top: j * gridSize,
            width: "100%",
            height: 1,
            background: "rgba(0,0,0,0.1)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
      )
    }
  }

  return (
    <div style={{ display: "flex", gap: 12, position: "relative" }}>
      {/* ----------------- JSX Editor ----------------- */}
      <div style={{ flex: 1 }}>
        <h3>Ultra Platinum JSX Editor</h3>

        <div style={{ marginBottom: 8 }}>
          {(["base", "tablet", "mobile"] as Breakpoint[]).map((bp) => (
            <button
              key={bp}
              onClick={() => setActiveBreakpoint(bp)}
              style={{
                marginRight: 8,
                padding: "4px 8px",
                background: activeBreakpoint === bp ? "#0070f4" : "#f5f5f5",
                color: activeBreakpoint === bp ? "#fff" : "#000",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              {bp}
            </button>
          ))}
        </div>

        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={{
            width: "100%",
            height: 250,
            fontFamily: "monospace",
            fontSize: 14,
            padding: 8,
            borderRadius: 4,
            border: "1px solid #ccc",
            marginBottom: 8,
          }}
        />

        <div style={{ marginBottom: 8 }}>
          <button
            onClick={handleApplyCode}
            style={{
              padding: "6px 12px",
              background: "#0070f4",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              marginRight: 8,
            }}
          >
            Apply Code
          </button>
          <button
            onClick={toggleGrid}
            style={{
              padding: "6px 12px",
              background: gridEnabled ? "#0070f4" : "#f5f5f5",
              color: gridEnabled ? "#fff" : "#000",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            {gridEnabled ? "Hide Grid" : "Show Grid"}
          </button>
        </div>

        {gridEnabled && (
          <input
            type="range"
            min={4}
            max={64}
            value={gridSize}
            onChange={(e) => setGridSize(Number(e.target.value))}
            style={{ width: "100%" }}
          />
        )}
      </div>

      {/* ----------------- Live Preview ----------------- */}
      <div
        style={{
          flex: 1,
          minHeight: 400,
          border: "1px solid #ccc",
          borderRadius: 4,
          padding: 8,
          background: "#f9f9f9",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <h3>Live Preview ({activeBreakpoint})</h3>

        {gridLines}

        {guides.map((g, idx) => (
          <div
            key={idx}
            style={{
              position: "absolute",
              left: g.x,
              top: g.y,
              width: g.width,
              height: g.height,
              backgroundColor: g.color,
              pointerEvents: "none",
              zIndex: 999,
            }}
          />
        ))}

        {liveComponents.map((c, idx) => {
          const laidOut = applyLayoutTree(c, activeBreakpoint)
          return (
            <div
              key={c.id}
              draggable
              onDragStart={(e) => handleDragStart(e, idx)}
              onDrop={(e) => handleDrop(e, idx)}
              onDragOver={handleDragOver}
              onClick={() => setSelectedIds([c.id])}
              style={{
                marginBottom: 8,
                outline: selectedIds.includes(c.id) ? "2px solid #0070f4" : "none",
                position: "relative",
                zIndex: selectedIds.includes(c.id) ? 1000 : 1,
              }}
            >
              <NodeRenderer component={laidOut} />
            </div>
          )
        })}
      </div>

      {/* ----------------- Prop Panel ----------------- */}
      {activeComponent && (
        <div style={{ width: 300, border: "1px solid #ccc", borderRadius: 4, padding: 8 }}>
          <h4>Props ({activeComponent.type})</h4>
          {Object.entries(activeComponent.propsPerBreakpoint[activeBreakpoint]).map(
            ([prop, value]) => (
              <div key={prop} style={{ marginBottom: 6 }}>
                <label style={{ display: "block", fontSize: 12, marginBottom: 2 }}>{prop}</label>
                <input
                  type={typeof value === "number" ? "number" : "text"}
                  value={value}
                  onChange={(e) =>
                    handlePropChange(prop, typeof value === "number" ? +e.target.value : e.target.value)
                  }
                  style={{ width: "100%", padding: 4, fontSize: 12 }}
                />
              </div>
            )
          )}
        </div>
      )}
    </div>
  )
}
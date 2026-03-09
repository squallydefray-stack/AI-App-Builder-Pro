// app/builder/components/GeneratedPreviewEditor.tsx
"use client"

import React, { useEffect, useState } from "react"
import { useBuilderStore } from "@/builder/state/builderStore"
import { Breakpoint, BuilderComponent } from "@lib/exporter/schema"
import { exportToReact } from "@lib/exporter/realExporter"
import NodeRenderer from "@/builder/components/NodeRenderer"
import { applySnapToComponents, applyLayoutTree } from "@lib/layout/masterLayoutCompiler"
import update from "immutability-helper"
import * as babelParser from "@babel/parser"
import traverse from "@babel/traverse"

const COMPONENT_TYPES = ["Text", "Button", "Container", "Image", "Form", "Video", "Card"]

const DEFAULT_PROPS: Record<string, any> = {
  Text: { text: "Text", width: 200, height: 50, color: "#000", fontSize: 16 },
  Button: { label: "Button", width: 120, height: 40, background: "#0070f4", color: "#fff", radius: 4 },
  Container: { width: 400, height: 300, background: "#f5f5f5", display: "flex", direction: "column", gap: 10 },
  Image: { src: "", width: 200, height: 200 },
  Form: { formFields: [], width: 300, height: 400, background: "#fff" },
  Video: { src: "", width: 400, height: 300 },
  Card: { width: 250, height: 150, background: "#fff", radius: 8, padding: 10 },
}

export default function UltraPlatinumEditor() {
  const pages = useBuilderStore((s) => s.pages)
  const activePageId = useBuilderStore((s) => s.activePageId)
  const activeBreakpoint = useBuilderStore((s) => s.activeBreakpoint)
  const addComponentsTransactional = useBuilderStore((s) => s.addComponentsTransactional)
  const updateMany = useBuilderStore((s) => s.updateMany)
  const setSelectedIds = useBuilderStore((s) => s.setSelectedIds)
  const setActiveBreakpoint = useBuilderStore((s) => s.setActiveBreakpoint)

  const [liveComponents, setLiveComponents] = useState<BuilderComponent[]>([])
  const [code, setCode] = useState("")

  useEffect(() => {
    if (!activePageId) return
    const page = pages.find((p) => p.id === activePageId)
    if (!page) return
    setLiveComponents(page.components)
  }, [pages, activePageId])

  useEffect(() => {
    const newCode = exportToReact(liveComponents, activeBreakpoint)
    setCode(newCode)
  }, [liveComponents, activeBreakpoint])

  /* ===== Parse JSX and map full props for all breakpoints ===== */
  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value
    setCode(newCode)

    try {
      const ast = babelParser.parse(newCode, {
        sourceType: "module",
        plugins: ["jsx", "typescript"],
      })

      const parsedComponents: BuilderComponent[] = []

      traverse(ast, {
        JSXElement(path) {
          const opening = path.node.openingElement
          if (opening.name.type === "JSXIdentifier") {
            const type = COMPONENT_TYPES.includes(opening.name.name) ? opening.name.name : "Container"

            const props: unknown = { ...DEFAULT_PROPS[type] }

            opening.attributes.forEach((attr: unknown) => {
              if (attr.type === "JSXAttribute") {
                if (attr.name.name === "style" && attr.value?.type === "JSXExpressionContainer") {
                  try {
                    Object.assign(props, eval("(" + attr.value.expression.extra.raw + ")"))
                  } catch {}
                } else if (attr.value?.type === "StringLiteral") {
                  props[attr.name.name] = attr.value.value
                }
              }
            })

            parsedComponents.push({
              id: crypto.randomUUID(),
              type,
              propsPerBreakpoint: {
                base: { ...props },
                tablet: { ...props },
                mobile: { ...props },
              },
              children: [],
              layout: { mode: "absolute", enabled: true },
            })
          }
        },
      })

      if (parsedComponents.length) {
        setLiveComponents(parsedComponents)
        updateMany(parsedComponents)
      }
    } catch (err) {
      // console.warn("JSX parse error:", err)  // TODO: remove before release
    }
  }

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

    const laidOut = reordered.map((c) =>
      applyLayoutTree(applySnapToComponents(c, reordered, activeBreakpoint), activeBreakpoint)
    )

    setLiveComponents(laidOut)
    updateMany(laidOut)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault()
  const handleApplyCode = () => addComponentsTransactional(liveComponents)

  return (
    <div style={{ display: "flex", gap: 12 }}>
      {/* JSX Editor */}
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
          onChange={handleCodeChange}
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

        <button
          onClick={handleApplyCode}
          style={{
            padding: "6px 12px",
            background: "#0070f4",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Apply Code
        </button>
      </div>

      {/* Live Preview */}
      <div
        style={{
          flex: 1,
          minHeight: 400,
          border: "1px solid #ccc",
          borderRadius: 4,
          padding: 8,
          background: "#f9f9f9",
        }}
      >
        <h3>Live Preview ({activeBreakpoint})</h3>
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
              style={{ marginBottom: 8 }}
            >
              <NodeRenderer component={laidOut} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

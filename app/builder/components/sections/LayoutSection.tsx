//
//  LayoutSection.tsx
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/17/26.
//


"use client"

import React from "react"
import Collapsible from "../ui/Collapsible"
import TokenSelect from "../ui/TokenSelect"
import { fontSizeTokens } from "@lib/design/tokens"
import { BuilderComponent, Breakpoint } from "@lib/exporter/schema"
import { useBuilderStore } from "@/state/builderStore"

interface Props {
  component: BuilderComponent
  breakpoint: Breakpoint
}

export default function LayoutSection({ component, breakpoint }: Props) {
  const { updateComponentProps } = useBuilderStore()
  const current = component.props[breakpoint] || {}

  const update = (key: string, value: string) => {
    updateComponentProps(component.id, breakpoint, {
      ...current,
      [key]: value,
    })
  }

  return (
    <Collapsible title="Layout">
      <TokenSelect
        label="Width"
        value={current.width}
        options={[
          { label: "Hug", value: "hug" },
          { label: "Fill", value: "fill" },
          { label: "Full", value: "w-full" },
        ]}
        onChange={(v) => update("width", v)}
      />

      <TokenSelect
        label="Height"
        value={current.height}
        options={[
          { label: "Hug", value: "hug" },
          { label: "Fill", value: "fill" },
        ]}
        onChange={(v) => update("height", v)}
      />
    </Collapsible>
  )
}

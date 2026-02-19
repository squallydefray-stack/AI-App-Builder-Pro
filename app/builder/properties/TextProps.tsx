// app/builder/components/properties/TextProps.tsx
"use client"

import React from "react"
import { BuilderComponent } from "../../lib/exporter/schema"
import PropsInspector from "../components/PropsInspector"

type TextPropsProps = { component: BuilderComponent }

export default function TextProps({ component }: TextPropsProps) {
  return (
    <div className="mt-4">
      <h4 className="font-semibold mb-2">Text Specific Props</h4>
      <PropsInspector component={component} />
    </div>
  )
}

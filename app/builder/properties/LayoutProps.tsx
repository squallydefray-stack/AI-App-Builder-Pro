//
//  LayoutProps.tsx
//  AiAppBuilderPro
//
//  Created by Squally Da Boss on 2/8/26.
//

// app/builder/components/properties/LayoutProps.tsx
"use client"

import React from "react"
import { BuilderComponent } from "../../lib/exporter/schema"
import PropsInspector from "../components/PropsInspector"

type LayoutPropsProps = { component: BuilderComponent }

export default function LayoutProps({ component }: LayoutPropsProps) {
  return (
    <div className="mt-4">
      <h4 className="font-semibold mb-2">Layout Specific Props</h4>
      <PropsInspector component={component} />
    </div>
  )
}

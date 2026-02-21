//
//  ButtonProps.tsx
//  AiAppBuilderPro
//
//  Created by Squally Da Boss on 2/8/26.
//

// app/builder/components/properties/ButtonProps.tsx
"use client"

import React from "react"
import { BuilderComponent } from "../../lib/exporter/schema"
import PropsInspector from "@builderComponents/PropsInspector"

type ButtonPropsProps = { component: BuilderComponent }

export default function ButtonProps({ component }: ButtonPropsProps) {
  return (
    <div className="mt-4">
      <h4 className="font-semibold mb-2">Button Specific Props</h4>
      <PropsInspector component={component} />
    </div>
  )
}

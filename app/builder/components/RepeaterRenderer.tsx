//
//  RepeaterRenderer.tsx
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/17/26.
//


"use client"

import React from "react"
import NodeRenderer from "./NodeRenderer"
import { BuilderComponent } from "@lib/exporter/schema"

interface RepeaterRendererProps {
  component: BuilderComponent
}

const RepeaterRenderer: React.FC<RepeaterRendererProps> = ({ component }) => {
  const dataArray: any[] = component.props.base?.data || []

  return (
    <>
      {dataArray.map((item, index) =>
        component.children?.map((child) => (
          <NodeRenderer
            key={`${child.id}-${index}`}
            component={{
              ...child,
              props: {
                ...child.props,
                base: { ...child.props.base, ...item },
              },
            }}
          />
        ))
      )}
    </>
  )
}

export default RepeaterRenderer

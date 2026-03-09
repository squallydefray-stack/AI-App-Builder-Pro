//
//  componentMapper.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/16/26.
//


// lib/exporter/componentMapper.ts
import { BuilderComponent, Breakpoint, ResponsiveProps } from "@lib/exporter/schema"
import { serializeStyles } from "./styleSerializer"

export function mapComponentToReact(component: BuilderComponent): string {
  const { type, props, children, responsiveProps } = component;

  // Convert responsiveProps to Tailwind-safe className
  const className = responsiveProps ? serializeStyles(responsiveProps) : "";

  switch (type) {
    case "container":
      return `<div className="${className}">
  ${children ? children.map(mapComponentToReact).join("\n") : ""}
</div>`;

    case "text":
      return `<p className="${className}">${props?.text || "Text"}</p>`;

    case "button":
      return `<button className="${className}">${props?.label || "Button"}</button>`;

    case "image":
      return `<img className="${className}" src="${props?.src || "/placeholder.png"}" alt="${props?.alt || ""}" />`;

    case "input":
      return `<input className="${className}" placeholder="${props?.placeholder || ""}" />`;

    default:
      return `<div className="${className}">${children ? children.map(mapComponentToReact).join("\n") : ""}</div>`;
  }
}

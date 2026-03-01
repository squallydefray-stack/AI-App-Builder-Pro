/* =============================
   BREAKPOINTS
============================= */
export type Breakpoint = "base" | "mobile" | "tablet" | "desktop";

/* =============================
   STYLING PROPS
============================= */
export interface StyleProps {
  x?: number;
  y?: number;
  width?: number | "hug" | "fill";
  height?: number | "hug" | "fill";
  backgroundColor?: string;
  color?: string;
  fontSize?: number;
  borderRadius?: number;
}

export type PropsPerBreakpoint = {
  [key in Breakpoint]?: StyleProps;
};

/* =============================
   POSITION
============================= */
export interface Position {
  x: number;
  y: number;
}

export type FlexDirection = "row" | "column";

/* =============================
   AUTO LAYOUT
============================= */
export interface AutoLayoutConfig {
  enabled: boolean;
  direction: FlexDirection;
  gap?: number;
  fillChildren?: boolean;
  hugChildren?: boolean;
}

export interface LayoutConfig {
  mode: "absolute" | "auto";
  autoLayout?: AutoLayoutConfig;
}

/* =============================
   COMPONENT TYPES
============================= */
export type ComponentType =
  | "Box"
  | "Button"
  | "Input"
  | "Card"
  | "Text"
  | "Image"
  | "Repeater";

export type ComponentProps = Record<string, any>;
export type ComponentStyle = Record<string, any>;

/* =============================
   BUILDER COMPONENTS & PAGES
============================= */
export interface BuilderComponent {
  id: string;
  type: ComponentType;
  props: ComponentProps;
  style?: ComponentStyle;
  position?: Position;
  propsPerBreakpoint?: PropsPerBreakpoint;
  layout?: LayoutConfig;
  children?: BuilderComponent[];
  parentId?: string | null;
}

export interface BuilderPage {
  id: string;
  name: string;
  components: BuilderComponent[];
  pages?: BuilderPage[];
}

export interface BuilderSchema {
  id: string;
  name: string;
  pages: BuilderPage[];
  components: BuilderComponent[];
}

/* =============================
   GENERIC NODE (for exports)
============================= */
export interface BuilderNode {
  id: string;
  type: string;
  props?: Record<string, unknown>;
  style?: Record<string, unknown>;
  responsive?: PropsPerBreakpoint;
  autoLayout?: AutoLayoutConfig;
  position?: Position;
  children?: BuilderNode[];
}

/* =============================
   CODE GENERATION HELPERS
============================= */
export function exportProject(schema: BuilderSchema) {
  return {
    web: generateNextJS(schema),
    mobile: generateReactNative(schema),
  };
}

export function exportToReact(components: BuilderNode[]): string {
  const body = components.map((node) => renderNode(node, 2)).join("\n");
  return `
import React from "react";

export default function GeneratedPage() {
  return (
    <>
${body}
    </>
  );
}
`.trim();
}

/* =============================
   NODE RENDERER
============================= */
function renderNode(node: BuilderNode, indentLevel: number): string {
  const indent = " ".repeat(indentLevel * 2);
  const tag = resolveTag(node.type);
  const props = buildProps(node.props);

  if (!node.children || node.children.length === 0) {
    if (node.type.toLowerCase() === "text") {
      return `${indent}${escapeText(node.props?.text as string || "")}`;
    }
    return `${indent}<${tag}${props} />`;
  }

  const children = node.children
    .map((child) => renderNode(child, indentLevel + 1))
    .join("\n");

  return `
${indent}<${tag}${props}>
${children}
${indent}</${tag}>`.trim();
}

/* =============================
   TAG RESOLUTION
============================= */
function resolveTag(type: string): string {
  switch (type.toLowerCase()) {
    case "button":
      return "button";
    case "text":
      return "span";
    case "card":
    case "box":
      return "div";
    case "input":
      return "input";
    case "image":
      return "img";
    default:
      return "div";
  }
}

/* =============================
   PROP BUILDER
============================= */
function buildProps(props?: Record<string, unknown>): string {
  if (!props) return "";

  return Object.entries(props)
    .filter(([key]) => key !== "text")
    .map(([key, value]) => {
      if (key === "className" && typeof value === "string")
        return ` className="${escapeAttribute(value)}"`;
      if (typeof value === "string") return ` ${key}="${escapeAttribute(value)}"`;
      if (typeof value === "boolean") return value ? ` ${key}` : "";
      return ` ${key}={${JSON.stringify(value)}}`;
    })
    .join("");
}

/* =============================
   ESCAPING
============================= */
function escapeText(text: string): string {
  return text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escapeAttribute(value: string): string {
  return value.replace(/"/g, "&quot;");
}

// lib/ai/NextRenderer.ts
// AI App Builder Pro — Ultra Platinum Renderer v2

import { BuilderComponent } from "@/lib/componentTypes"

/* ============================================================
   TYPE EXTENSIONS
============================================================ */

type ResponsiveMap = {
  base?: { className?: string }
  sm?: { className?: string }
  md?: { className?: string }
  lg?: { className?: string }
  xl?: { className?: string }
}

/* ============================================================
   UTIL — Tailwind Safe Join
============================================================ */

function cx(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ")
}

/* ============================================================
   RESPONSIVE CLASS BUILDER
============================================================ */

function buildResponsiveClasses(component: BuilderComponent): string {
  const r = (component as unknown).responsive as ResponsiveMap | undefined
  if (!r) return ""

  const build = (prefix: string, obj?: { className?: string }) =>
    obj?.className ? `${prefix}${obj.className}` : ""

  return cx(
    build("", r.base),
    build("sm:", r.sm),
    build("md:", r.md),
    build("lg:", r.lg),
    build("xl:", r.xl)
  )
}

/* ============================================================
   GRID AUTO COLUMN DETECTOR
============================================================ */

function inferGridColumns(children?: BuilderComponent[]): string {
  if (!children || children.length === 0) return "grid-cols-1"

  const count = children.length

  if (count === 1) return "grid-cols-1"
  if (count === 2) return "grid-cols-2"
  if (count === 3) return "grid-cols-3"
  if (count === 4) return "grid-cols-4"

  return "grid-cols-4"
}

/* ============================================================
   AUTO ANIMATION WRAPPER
============================================================ */

function wrapWithMotionIfNeeded(
  jsx: string,
  component: BuilderComponent
): string {
  if ((component as unknown).animate) {
    return `<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4 }}
>
${jsx}
</motion.div>`
  }

  return jsx
}

/* ============================================================
   CHILD RENDERER
============================================================ */

function renderChildren(children?: BuilderComponent[]): string {
  if (!children || children.length === 0) return ""
  return children.map(renderComponentToJSX).join("\n")
}

/* ============================================================
   MAIN COMPONENT RENDERER
============================================================ */

export function renderComponentToJSX(
  component: BuilderComponent
): string {
  const { type, props = {}, children } = component
  const responsiveClasses = buildResponsiveClasses(component)
  const childJSX = renderChildren(children)

  let jsx = ""

  switch (type) {
    /* ==============================
       TEXT
    ============================== */
    case "Text":
      jsx = `<p className="${cx(
        "text-base",
        responsiveClasses,
        props.dark ? "dark:text-white" : ""
      )}">
  ${props.text ?? "Text"}
</p>`
      break

    /* ==============================
       BUTTON
    ============================== */
    case "Button":
      if (props.variant === "shadcn") {
        jsx = `<Button className="${responsiveClasses}">
  ${props.text ?? "Click"}
</Button>`
      } else {
        jsx = `<button className="${cx(
          "px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700",
          responsiveClasses
        )}">
  ${props.text ?? "Click"}
</button>`
      }
      break

    /* ==============================
       IMAGE
    ============================== */
    case "Image":
      jsx = `<img
  src="${props.src ?? "/placeholder.png"}"
  alt="${props.alt ?? "image"}"
  className="${responsiveClasses}"
/>`
      break

    /* ==============================
       INPUT
    ============================== */
    case "Input":
      jsx = `<input
  placeholder="${props.placeholder ?? ""}"
  className="${cx(
    "border rounded px-3 py-2",
    responsiveClasses
  )}"
/>`
      break

    /* ==============================
       CARD
    ============================== */
    case "Card":
      jsx = `<div className="${cx(
        "rounded-xl shadow-md p-4 bg-white dark:bg-gray-900",
        responsiveClasses
      )}">
  ${childJSX}
</div>`
      break

    /* ==============================
       GRID
    ============================== */
    case "Grid":
      jsx = `<div className="${cx(
        "grid gap-6",
        inferGridColumns(children),
        responsiveClasses
      )}">
  ${childJSX}
</div>`
      break

    /* ==============================
       CONTAINER / SECTION
    ============================== */
    case "Container":
    case "Section":
      jsx = `<div className="${cx(
        "w-full max-w-7xl mx-auto px-6",
        responsiveClasses
      )}">
  ${childJSX}
</div>`
      break

    /* ==============================
       NAVBAR
    ============================== */
    case "Navbar":
      jsx = `<nav className="${cx(
        "w-full flex items-center justify-between py-4",
        responsiveClasses
      )}">
  ${childJSX}
</nav>`
      break

    /* ==============================
       FOOTER
    ============================== */
    case "Footer":
      jsx = `<footer className="${cx(
        "w-full py-8 text-center text-sm text-gray-500",
        responsiveClasses
      )}">
  ${childJSX}
</footer>`
      break

    default:
      jsx = ""
  }

  return wrapWithMotionIfNeeded(jsx, component)
}
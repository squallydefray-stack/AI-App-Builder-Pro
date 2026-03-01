// export/next/componentTemplates.ts
import { BuilderComponent } from "@lib/exporter/schema"

interface ComponentTemplate {
  render: (comp: BuilderComponent) => string
}

/**
 * All Builder component types → Next.js + Tailwind JSX
 */
export const componentTemplates: Record<string, ComponentTemplate> = {
  text: {
    render: (comp) => {
      const text = comp.props.base?.text || "Sample text"
      const classes = comp.props.base?.className || "text-base text-gray-800"
      return `<p key="${comp.id}" className="${classes}">${text}</p>`
    },
  },

  button: {
    render: (comp) => {
      const label = comp.props.base?.label || "Click me"
      const classes = comp.props.base?.className || "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      return `<button key="${comp.id}" className="${classes}">${label}</button>`
    },
  },

  image: {
    render: (comp) => {
      const src = comp.props.base?.src || "/placeholder.png"
      const alt = comp.props.base?.alt || "Image"
      const classes = comp.props.base?.className || "w-full h-auto rounded"
      return `<img key="${comp.id}" src="${src}" alt="${alt}" className="${classes}" />`
    },
  },

  container: {
    render: (comp) => {
      const classes = comp.props.base?.className || "flex flex-col p-4 space-y-4"
      const children = (comp.children || [])
        .map((child) => componentTemplates[child.type]?.render(child) || "")
        .join("\n")
      return `<div key="${comp.id}" className="${classes}">\n${children}\n</div>`
    },
  },

  grid: {
    render: (comp) => {
      const cols = comp.props.base?.columns || 2
      const gap = comp.props.base?.gap || 4
      const classes = `grid grid-cols-${cols} gap-${gap}`
      const children = (comp.children || [])
        .map((child) => componentTemplates[child.type]?.render(child) || "")
        .join("\n")
      return `<div key="${comp.id}" className="${classes}">\n${children}\n</div>`
    },
  },

  input: {
    render: (comp) => {
      const placeholder = comp.props.base?.placeholder || "Enter text"
      const value = comp.props.base?.value || ""
      const classes = comp.props.base?.className || "border p-2 rounded w-full"
      return `<input key="${comp.id}" type="text" value="${value}" placeholder="${placeholder}" className="${classes}" />`
    },
  },

  textarea: {
    render: (comp) => {
      const placeholder = comp.props.base?.placeholder || "Enter text"
      const value = comp.props.base?.value || ""
      const classes = comp.props.base?.className || "border p-2 rounded w-full"
      return `<textarea key="${comp.id}" placeholder="${placeholder}" className="${classes}">${value}</textarea>`
    },
  },

  select: {
    render: (comp) => {
      const options = comp.props.base?.options || ["Option 1", "Option 2"]
      const classes = comp.props.base?.className || "border p-2 rounded w-full"
      const optionsStr = options.map((opt: string) => `<option value="${opt}">${opt}</option>`).join("\n")
      return `<select key="${comp.id}" className="${classes}">\n${optionsStr}\n</select>`
    },
  },

  link: {
    render: (comp) => {
      const href = comp.props.base?.href || "#"
      const text = comp.props.base?.text || "Link"
      const classes = comp.props.base?.className || "text-blue-600 underline"
      return `<a key="${comp.id}" href="${href}" className="${classes}">${text}</a>`
    },
  },

  card: {
    render: (comp) => {
      const classes = comp.props.base?.className || "border p-4 rounded shadow"
      const children = (comp.children || [])
        .map((child) => componentTemplates[child.type]?.render(child) || "")
        .join("\n")
      return `<div key="${comp.id}" className="${classes}">\n${children}\n</div>`
    },
  },

  modal: {
    render: (comp) => {
      const classes = comp.props.base?.className || "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      const content = (comp.children || [])
        .map((child) => componentTemplates[child.type]?.render(child) || "")
        .join("\n")
      return `<div key="${comp.id}" className="${classes}">\n<div className="bg-white p-6 rounded">${content}</div>\n</div>`
    },
  },

  // Add more as needed (tabs, carousels, lists, forms, charts)
}

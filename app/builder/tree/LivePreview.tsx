"use client"
import { useBuilderStore } from "@/state/builderStore"

function renderNode(node: any): any {
  const Tag = node.type === "Header" ? "header" : "div"

  return (
    <Tag key={node.id}>
      {node.children?.map(renderNode)}
    </Tag>
  )
}

export default function LivePreview() {
  const components = useBuilderStore((s) => s.components)

  return (
    <iframe
      className="w-full h-full"
      srcDoc={`<html><body>${renderNodeToString(
        components
      )}</body></html>`}
    />
  )
}

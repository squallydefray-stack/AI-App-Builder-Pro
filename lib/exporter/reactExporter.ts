export function exportToReact(components) {
  return components.map(renderNode).join("\n")
}

function renderNode(node) {
  const children = node.children?.map(renderNode).join("\n") || ""
  return `
    <div>
      ${children}
    </div>
  `
}

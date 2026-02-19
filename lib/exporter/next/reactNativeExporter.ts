function generateRNComponent(node) {
  if (node.type === "Text") {
    return `<Text>${node.props.base.text}</Text>`
  }

  if (node.type === "Button") {
    return `<TouchableOpacity><Text>${node.props.base.label}</Text></TouchableOpacity>`
  }

  return `<View>${node.children?.map(generateRNComponent).join("")}</View>`
}

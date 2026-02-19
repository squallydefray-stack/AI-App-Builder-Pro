export function getSnapPosition(
  rect: DOMRect,
  pointerY: number
): "before" | "inside" | "after" {
  const offset = pointerY - rect.top
  const ratio = offset / rect.height

  if (ratio < 0.25) return "before"
  if (ratio > 0.75) return "after"
  return "inside"
}

import html2canvas from "html2canvas"

export async function generateThumbnail() {
  const canvas = document.getElementById("builder-canvas")
  if (!canvas) return null

  const snapshot = await html2canvas(canvas)
  return snapshot.toDataURL("image/png")
}

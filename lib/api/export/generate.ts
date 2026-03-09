import { generateNextApp } from "@/lib/exporter/nextjs/generate"
import { generateReactNative } from "@/lib/exporter/react-native/generate"
import { buildZip } from "@/lib/exporter/zip"

export async function POST(req: Request) {
  const { schema, target } = await req.json()

  const files =
    target === "react-native"
      ? generateReactNative(schema)
      : generateNextApp(schema)

  const zip = await buildZip(files)

  return new Response(zip, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": "attachment; filename=app.zip",
    },
  })
}

//
//  download.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/13/26.
//


// lib/exporter/download.ts

export function downloadJSON(data: any, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  })

  const url = URL.createObjectURL(blob)

  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()

  URL.revokeObjectURL(url)
}

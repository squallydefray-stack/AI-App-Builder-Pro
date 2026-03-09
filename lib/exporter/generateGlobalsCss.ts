// lib/exporter/generateGlobalsCss.ts

export function generateGlobalsCss(theme?: {
  primaryColor?: string
  fontFamily?: string
  radius?: number
}) {
  return `
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --primary: ${theme?.primaryColor ?? "#000000"};
  --radius: ${theme?.radius ?? 6}px;
}

body {
  font-family: ${theme?.fontFamily ?? "Inter, sans-serif"};
}
`.trim()
}

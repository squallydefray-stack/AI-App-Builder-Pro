export function generatePageJSX(components: BuilderComponent[]): string {
  const desktopJSX = components.map((c) => generateComponentJSX(c, "desktop")).join("\n")
  const tabletJSX = components.map((c) => generateComponentJSX(c, "tablet")).join("\n")
  const mobileJSX = components.map((c) => generateComponentJSX(c, "mobile")).join("\n")

  return `
<div class="">
  <div class="hidden md:block lg:block">${desktopJSX}</div>
  <div class="md:hidden lg:block">${tabletJSX}</div>
  <div class="block md:hidden">${mobileJSX}</div>
</div>
`
}

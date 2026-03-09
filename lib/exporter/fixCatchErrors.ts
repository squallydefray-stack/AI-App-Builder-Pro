// fixCatchErrorsSafe.ts
import * as fs from "fs"
import * as path from "path"

const projectDir = path.resolve("./src") // adjust to your code folder

function walk(dir: string) {
  const files = fs.readdirSync(dir)
  for (const file of files) {
    const fullPath = path.join(dir, file)
    const stat = fs.statSync(fullPath)
    if (stat.isDirectory()) {
      walk(fullPath)
    } else if (fullPath.endsWith(".ts") || fullPath.endsWith(".tsx")) {
      fixFile(fullPath)
    }
  }
}

function fixFile(filePath: string) {
  let content = fs.readFileSync(filePath, "utf-8")

  // Regex to match catch (err: any) { ... } including multi-line bodies
  const catchRegex = /catch\s*\(\s*err\s*:\s*any\s*\)\s*\{([\s\S]*?)\n\}/gm

  content = content.replace(catchRegex, (_, body) => {
    // Detect the indentation of the catch block
    const lines = body.split("\n")
    const leadingSpaces = lines[0]?.match(/^(\s*)/)?.[1] || "  "

    // Indent original body one level deeper
    const indentedBody = lines
      .map((line) => leadingSpaces + "  " + line.trim())
      .join("\n")

    // Wrap in instance-of check preserving indentation
    return `catch (err: unknown) {
${leadingSpaces}if (err instanceof Error) {
${indentedBody}
${leadingSpaces}} else {
// ${leadingSpaces}  console.error("Unknown error", err)  // TODO: remove before release
${leadingSpaces}}
}`
  })

  fs.writeFileSync(filePath, content, "utf-8")
  // console.log(`✅ Fixed catch in ${filePath}`)  // TODO: remove before release
}

walk(projectDir)

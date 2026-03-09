export function indent(code: string, spaces = 2) {
  return code
    .split("\n")
    .map((l) => " ".repeat(spaces) + l)
    .join("\n")
}

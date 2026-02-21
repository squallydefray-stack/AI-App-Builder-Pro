/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: "./tsconfig.json"
  },
  plugins: ["@typescript-eslint", "react", "react-hooks", "tailwindcss"],
  extends: [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:tailwindcss/recommended"
  ],
  settings: {
    react: { version: "detect" }
  },
  rules: {
    // TypeScript
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/consistent-type-imports": "warn",

    // React
    "react/react-in-jsx-scope": "off",
    "react/jsx-key": "warn",

    // TailwindCSS
    "tailwindcss/classnames-order": "warn",
    "tailwindcss/no-custom-classname": "off",

    // General
    "no-console": "warn",
    "no-unused-vars": "warn",
    "prefer-const": "warn"
  },
  ignorePatterns: ["node_modules/", ".next/", "out/", "dist/", "public/"]
}

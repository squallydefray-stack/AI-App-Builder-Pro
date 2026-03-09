//
//  tokens.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/16/26.
//


export const designTokens = {
  colors: {
    primary: "#6366f1",
    secondary: "#ec4899",
    background: "#0a0a0a",
    surface: "#111111",
    text: "#ffffff",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  fontSize: {
    sm: 12,
    base: 16,
    lg: 20,
    xl: 28,
    "2xl": 36,
  },
}

export const spacingTokens = [
  { label: "0", value: "0px" },
  { label: "1", value: "4px" },
  { label: "2", value: "8px" },
  { label: "3", value: "12px" },
  { label: "4", value: "16px" },
  { label: "5", value: "20px" },
  { label: "6", value: "24px" },
]

export const fontSizeTokens = [
  { label: "XS", value: "text-xs" },
  { label: "SM", value: "text-sm" },
  { label: "Base", value: "text-base" },
  { label: "LG", value: "text-lg" },
  { label: "XL", value: "text-xl" },
  { label: "2XL", value: "text-2xl" },
  { label: "3XL", value: "text-3xl" },
]

export const fontWeightTokens = [
  { label: "Light", value: "font-light" },
  { label: "Normal", value: "font-normal" },
  { label: "Medium", value: "font-medium" },
  { label: "Bold", value: "font-bold" },
]

export const colorTokens = [
  { label: "Primary", value: "bg-blue-500" },
  { label: "Secondary", value: "bg-gray-200" },
  { label: "Danger", value: "bg-red-500" },
]

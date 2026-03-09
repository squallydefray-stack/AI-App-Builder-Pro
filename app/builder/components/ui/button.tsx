//
//  Button.tsx
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/22/26.
//


// app/builder/components/ui/Button.tsx
"use client"

import React, { ButtonHTMLAttributes } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string
}

export const Button: React.FC<ButtonProps> = ({ label, className = "", ...props }) => {
  return (
    <button
      {...props}
      className={`px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition ${className}`}
    >
      {label || "Button"}
    </button>
  )
}
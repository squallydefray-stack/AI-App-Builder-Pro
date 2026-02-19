// app/page.tsx
"use client"
import React from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold mb-6">Dashboard</h1>
      <p className="text-gray-400 mb-10">Access your projects, recent builds, and exports.</p>
      <button
        onClick={() => router.push("/builder")}
        className="px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl text-lg font-semibold transition"
      >
        Open Builder
      </button>
    </div>
  )
}

//
//  DeploymentLogsLive.tsx
//  AI-App-Builder-Pro
//

"use client"

import { useEffect, useRef, useState } from "react"
import { createClient } from "@supabase/supabase-js"

type DeploymentTerminalProps = {
  deploymentId: string
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

export default function DeploymentTerminal({ deploymentId }: DeploymentTerminalProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [lines, setLines] = useState<string[]>([])
  const [visibleText, setVisibleText] = useState<string[]>([])
  const [cursorColor, setCursorColor] = useState("bg-white")
  const [isBlinkFast, setIsBlinkFast] = useState(true)

  // Subscribe to deployment logs
  useEffect(() => {
    const subscription = supabase
      .from(`deployments:id=eq.${deploymentId}`)
      .on("UPDATE", (payload) => {
        if (payload.new.logs) {
          const newLines = payload.new.logs.split("\n")
          setLines(newLines)
        }
      })
      .subscribe()

    return () => {
      supabase.removeSubscription(subscription)
    }
  }, [deploymentId])

  // Typing effect for each line
  useEffect(() => {
    let currentLineIndex = 0
    let currentCharIndex = 0
    let tempVisible: string[] = []

    const typeInterval = setInterval(() => {
      if (currentLineIndex >= lines.length) {
        clearInterval(typeInterval)
        setIsBlinkFast(false)
        return
      }

      const line = lines[currentLineIndex] || ""
      currentCharIndex++
      tempVisible[currentLineIndex] = line.slice(0, currentCharIndex)
      setVisibleText([...tempVisible])

      // Move to next line
      if (currentCharIndex >= line.length) {
        currentLineIndex++
        currentCharIndex = 0
      }

      // Update cursor color based on last line
      const lastLine = lines[lines.length - 1] || ""
      if (/SUCCESS/i.test(lastLine)) setCursorColor("bg-green-400")
      else if (/ERROR/i.test(lastLine)) setCursorColor("bg-red-500")
      else setCursorColor("bg-white")
    }, 20)

    return () => clearInterval(typeInterval)
  }, [lines])

  // Auto-scroll
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [visibleText])

  const cursorClass = `inline-block w-1 h-4 ml-1 ${cursorColor} ${
    isBlinkFast ? "animate-blink-fast" : "animate-blink-slow"
  }`

  return (
    <div className="relative max-h-[400px] overflow-y-auto font-mono text-sm p-2 bg-neutral-900 rounded shadow-inner" ref={containerRef}>
      {/* Top/Bottom fade shadows */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-neutral-900 to-transparent z-10" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-neutral-900 to-transparent z-10" />

      {visibleText.map((line, idx) => {
        const isLast = idx === visibleText.length - 1
        let colorClass = "text-neutral-300"
        if (/ERROR/i.test(line)) colorClass = "text-red-500"
        else if (/WARN/i.test(line)) colorClass = "text-yellow-400"
        else if (/INFO/i.test(line)) colorClass = "text-green-400"

        return (
          <div key={idx} className={`transition-opacity duration-300 opacity-100 ${colorClass}`}>
            {line}
            {isLast && <span className={cursorClass} />}
          </div>
        )
      })}
    </div>
  )
}

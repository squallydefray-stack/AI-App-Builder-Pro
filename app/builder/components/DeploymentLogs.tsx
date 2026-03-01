//
//  DeploymentLogs.tsx
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/21/26.
//

"use client"

import { useEffect, useRef, useState } from "react"

export default function DeploymentLogs({ logs }: { logs: string }) {
  const logContainerRef = useRef<HTMLDivElement>(null)
  const [showCursor, setShowCursor] = useState(false)
  const [blinkSpeed, setBlinkSpeed] = useState("animate-blink-slow")
  const [cursorColor, setCursorColor] = useState("bg-white")
  const [prevLogs, setPrevLogs] = useState("")
  const [visibleLines, setVisibleLines] = useState<string[]>([])

  // Handle incoming logs
  useEffect(() => {
    if (!logs) return

    if (logs !== prevLogs) {
      setShowCursor(true)
      setPrevLogs(logs)

      // Split lines and determine which are new
      const allLines = logs.split("\n")
      const oldLinesCount = visibleLines.length
      const newLines = allLines.slice(oldLinesCount)

      // Append new lines with fade-in
      setVisibleLines((prev) => [...prev, ...newLines])

      // Blink speed for streaming
      setBlinkSpeed("animate-blink-fast")

      // Last line color logic
      const lastLine = allLines[allLines.length - 1] || ""
      if (/SUCCESS/i.test(lastLine)) setCursorColor("bg-green-400")
      else if (/ERROR/i.test(lastLine)) setCursorColor("bg-red-500")
      else setCursorColor("bg-white")

      // Slow down blinking after 1.5s idle
      const timeout = setTimeout(() => setBlinkSpeed("animate-blink-slow"), 1500)
      return () => clearTimeout(timeout)
    }
  }, [logs, prevLogs])

  // Auto-scroll
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight
    }
  }, [visibleLines])

  const toggleLineClass = (line: string, isLast: boolean) => {
    if (isLast) return "text-white font-bold bg-neutral-800 px-1 rounded"
    if (/ERROR/i.test(line)) return "text-red-500"
    if (/WARN/i.test(line)) return "text-yellow-400"
    if (/INFO/i.test(line)) return "text-green-400"
    return "text-neutral-300"
  }

  const cursorStyle = `inline-block w-1 h-4 ml-1 ${cursorColor} ${blinkSpeed}`

  return (
    <div
      ref={logContainerRef}
      className="max-h-[400px] overflow-y-auto font-mono text-sm p-2 bg-neutral-900 rounded"
    >
      {visibleLines.map((line, idx) => {
        const isLast = idx === visibleLines.length - 1
        return (
          <div
            key={idx}
            className={`${toggleLineClass(line, isLast)} transition-opacity duration-500 opacity-0 animate-fade-in`}
            style={{ animationFillMode: "forwards", animationDelay: `${idx * 50}ms` }}
          >
            {line}
            {isLast && showCursor && <span className={cursorStyle} />}
          </div>
        )
      })}
    </div>
  )
}

//
//  ExportFeedbackPanel.tsx
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/17/26.
//


"use client"

import React, { useState, useEffect } from "react"
import { BuilderSchema } from "@lib/exporter/schema"
import { pushToGitHub } from "@/lib/exporter/githubPush" // your server/API wrapper
import { useBuilderStore } from "@/state/builderStore"

interface ExportFeedbackPanelProps {
  liveCode: string
}

const ExportFeedbackPanel: React.FC<ExportFeedbackPanelProps> = ({ liveCode }) => {
  const { pages } = useBuilderStore()
  const [platform, setPlatform] = useState<"nextjs"|"reactnative">("nextjs")
  const [branch, setBranch] = useState("main")
  const [commitMessage, setCommitMessage] = useState("AI Builder Export")
  const [status, setStatus] = useState<string>("Idle")
  const [isPushing, setIsPushing] = useState(false)

  // -------------------------
  // Live Export Preview
  // -------------------------
  const [preview, setPreview] = useState<string>("")
  useEffect(()=>{
    setPreview(liveCode)
  }, [liveCode])

  // -------------------------
  // GitHub Push Handler
  // -------------------------
  const handlePush = async () => {
    setIsPushing(true)
    setStatus("Preparing export...")
    try {
      const schema: BuilderSchema = { pages }
      setStatus("Generating code...")
      // Call your server-side API to generate files
      const result = await pushToGitHub({
        schema,
        platform,
        branch,
        commitMessage,
      })
      if(result.success){
        setStatus(`✅ Push successful to branch "${branch}"!`)
      }else{
        setStatus(`❌ Push failed: ${result.error}`)
      }
    }catch(err:any){
      setStatus(`❌ Error: ${err.message}`)
    }finally{
      setIsPushing(false)
    }
  }

  return (
    <div className="w-full border rounded-lg p-2 flex flex-col gap-2 bg-gray-50">
      <div className="flex gap-2">
        <button className={`px-3 py-1 rounded ${platform==="nextjs"?"bg-blue-500 text-white":"bg-gray-200"}`} onClick={()=>setPlatform("nextjs")}>Next.js</button>
        <button className={`px-3 py-1 rounded ${platform==="reactnative"?"bg-green-500 text-white":"bg-gray-200"}`} onClick={()=>setPlatform("reactnative")}>React Native</button>
      </div>

      <textarea
        value={preview}
        readOnly
        className="w-full h-48 p-2 font-mono text-xs bg-gray-100 rounded overflow-auto"
      />

      <div className="flex gap-2 items-center">
        <input type="text" placeholder="Branch" value={branch} onChange={e=>setBranch(e.target.value)} className="px-2 py-1 border rounded flex-1"/>
        <input type="text" placeholder="Commit message" value={commitMessage} onChange={e=>setCommitMessage(e.target.value)} className="px-2 py-1 border rounded flex-2"/>
        <button disabled={isPushing} onClick={handlePush} className="px-3 py-1 bg-indigo-500 text-white rounded">{isPushing?"Pushing...":"Push to GitHub"}</button>
      </div>

      <div className="text-sm font-mono text-gray-700">{status}</div>
    </div>
  )
}

export default ExportFeedbackPanel

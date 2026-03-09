//
//  IframeLiveEditing.tsx
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/17/26.
//


"use client"

import React, { useRef, useState, useEffect, useCallback } from "react"
import { useBuilderStore } from "../state/builderStore"
import { BuilderSchema, BuilderComponent } from "@lib/exporter/schema"
import { convertToNextTailwind, convertToReactNative } from "@/lib/exporter/codeGenerator"
import { reflowAutoLayout, applyConstraints } from "@/lib/utils/autoLayoutEngine"
import ExportFeedbackPanel from "./ExportFeedbackPanel"

interface IframeLiveEditingProps {
  zoom?: number
}

export default function IframeLiveEditing({ zoom = 1 }: IframeLiveEditingProps) {
  const { pages, selectedIds, setSelection, updateMultipleComponents } = useBuilderStore()
  const page = pages[0]
  const [platform, setPlatform] = useState<"nextjs" | "reactnative">("nextjs")
  const [liveCode, setLiveCode] = useState<string>("")
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // -------------------------
  // Generate live export code per platform
  // -------------------------
  const generateLiveCode = useCallback(() => {
    const code =
      platform === "nextjs"
        ? convertToNextTailwind({ pages } as BuilderSchema)
        : convertToReactNative({ pages } as BuilderSchema)
    setLiveCode(code)
  }, [pages, platform])

  useEffect(() => {
    generateLiveCode()
  }, [generateLiveCode])

  // -------------------------
  // Write live code + inject drag handlers
  // -------------------------
  const writeIframe = useCallback(() => {
    if (!iframeRef.current) return
    const doc = iframeRef.current.contentDocument
    if (!doc) return

    const serializedComponents = JSON.stringify(page.components)

    doc.open()
    if (platform === "reactnative") {
      doc.write(`
        <html>
          <head><meta charset="UTF-8" /><title>RN Live</title>
          <style>body{margin:0;font-family:sans-serif;}#root{width:100%;height:100%;display:flex;flex-direction:column;}</style>
          </head>
          <body>
            <div id="root"></div>
            <script type="module">
              const components = ${serializedComponents};
              const parentWidth = window.innerWidth;
              const parentHeight = window.innerHeight;

              function render() {
                const root = document.getElementById("root");
                root.innerHTML = "";
                components.forEach(c => {
                  const el = document.createElement("div");
                  el.id = c.id;
                  el.style.position = "absolute";
                  el.style.left = c.props.base?.x + "px" || "0px";
                  el.style.top = c.props.base?.y + "px" || "0px";
                  el.style.width = (c.props.base?.width || 100) + "px";
                  el.style.height = (c.props.base?.height || 40) + "px";
                  el.style.border = "1px solid #3b82f6";
                  el.style.background = "#dbeafe";
                  el.style.display = "flex";
                  el.style.alignItems = "center";
                  el.style.justifyContent = "center";
                  el.innerText = c.props.base?.text || c.type;
                  root.appendChild(el);

                  // -------------------------
                  // Make draggable inside iframe
                  // -------------------------
                  let isDragging = false;
                  let offsetX=0, offsetY=0;
                  el.addEventListener("mousedown", e=>{
                    isDragging=true;
                    offsetX = e.offsetX;
                    offsetY = e.offsetY;
                    parent.postMessage({ type:"start-drag", id: c.id }, "*")
                  });
                  window.addEventListener("mousemove", e=>{
                    if(!isDragging) return;
                    const x = e.clientX - offsetX;
                    const y = e.clientY - offsetY;
                    el.style.left = x+"px";
                    el.style.top = y+"px";
                    parent.postMessage({ type:"dragging", id: c.id, x, y }, "*")
                  });
                  window.addEventListener("mouseup", e=>{
                    if(isDragging){
                      isDragging=false;
                      const x = parseFloat(el.style.left);
                      const y = parseFloat(el.style.top);
                      parent.postMessage({ type:"drag-end", id: c.id, x, y }, "*")
                    }
                  });
                });
              }

              render();
            </script>
          </body>
        </html>
      `)
    } else {
      doc.write(`
        <html>
          <head>
            <meta charset="UTF-8">
            <title>Next.js Live</title>
            <script src="https://cdn.tailwindcss.com"></script>
          </head>
          <body class="p-4">
            <div id="root"></div>
            <script type="module">
              const components = ${serializedComponents};
              const root = document.getElementById("root");
              components.forEach(c=>{
                const el = document.createElement("div");
                el.id = c.id;
                el.className = "border border-blue-500 bg-blue-100 p-2 m-1 rounded";
                el.style.position="absolute";
                el.style.left=(c.props.base?.x||0)+"px";
                el.style.top=(c.props.base?.y||0)+"px";
                el.style.width=(c.props.base?.width||100)+"px";
                el.style.height=(c.props.base?.height||40)+"px";
                el.innerText = c.props.base?.text||c.type;
                root.appendChild(el);

                // -------------------------
                // Draggable
                // -------------------------
                let dragging=false, offsetX=0, offsetY=0;
                el.addEventListener("mousedown", e=>{
                  dragging=true; offsetX=e.offsetX; offsetY=e.offsetY;
                });
                window.addEventListener("mousemove", e=>{
                  if(dragging){
                    const x = e.clientX-offsetX;
                    const y = e.clientY-offsetY;
                    el.style.left=x+"px";
                    el.style.top=y+"px";
                    parent.postMessage({ type:"dragging", id:c.id, x, y }, "*");
                  }
                });
                window.addEventListener("mouseup", e=>{
                  if(dragging){
                    dragging=false;
                    const x=parseFloat(el.style.left);
                    const y=parseFloat(el.style.top);
                    parent.postMessage({ type:"drag-end", id:c.id, x, y }, "*");
                  }
                });
              });
            </script>
          </body>
        </html>
      `)
    }
    doc.close()
  }, [page.components, platform])

  useEffect(() => {
    writeIframe()
  }, [writeIframe])

  // -------------------------
  // Receive messages from iframe to update builder store
  // -------------------------
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      const data = e.data
      if (!data || !["dragging","drag-end"].includes(data.type)) return
      const { id, x, y } = data
      const updatedComponents = page.components.map(c=>{
        if(c.id===id){
          return { ...c, props: { ...c.props, base: { ...c.props.base, x, y } } }
        }
        return c
      })
      updateMultipleComponents(updatedComponents)
    }
    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [page.components, updateMultipleComponents])

  return (
    <div className="flex flex-col w-full h-full gap-2">
      {/* Platform Toggle */}
      <div className="flex gap-2">
        <button className={`px-3 py-1 rounded ${platform==="nextjs"?"bg-blue-500 text-white":"bg-gray-200"}`} onClick={()=>setPlatform("nextjs")}>Next.js / Tailwind</button>
        <button className={`px-3 py-1 rounded ${platform==="reactnative"?"bg-green-500 text-white":"bg-gray-200"}`} onClick={()=>setPlatform("reactnative")}>React Native</button>
      </div>

      {/* Live Editable Iframe */}
      <div className="flex-1 border rounded-lg overflow-hidden relative" style={{ transform:`scale(${zoom})`, transformOrigin:"top left" }}>
        <iframe ref={iframeRef} title="Live Iframe Editor" className="w-full h-full border-none" />
      </div>

      {/* Live Export Code Panel */}
      <ExportFeedbackPanel liveCode={liveCode} />
    </div>
  )
}


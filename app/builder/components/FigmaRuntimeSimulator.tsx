//
//  FigmaRuntimeSimulator.tsx
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/17/26.
//


"use client"

import React, { useRef, useState, useEffect, useCallback } from "react"
import { useBuilderStore } from "@/state/builderStore"
import { BuilderSchema, BuilderComponent } from "@lib/exporter/schema"
import { convertToNextTailwind, convertToReactNative } from "@/lib/exporter/codeGenerator"
import { reflowAutoLayout, applyConstraints } from "@/lib/utils/autoLayoutEngine"
import ExportFeedbackPanel from "./ExportFeedbackPanel"

interface FigmaRuntimeSimulatorProps {
  zoom?: number
}

export default function FigmaRuntimeSimulator({ zoom = 1 }: FigmaRuntimeSimulatorProps) {
  const { pages, selectedIds, setSelection, updateMultipleComponents } = useBuilderStore()
  const page = pages[0]
  const [platform, setPlatform] = useState<"nextjs" | "reactnative">("nextjs")
  const [liveCode, setLiveCode] = useState<string>("")
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // -------------------------
  // Generate live export code
  // -------------------------
  const generateLiveCode = useCallback(() => {
    const code =
      platform === "nextjs"
        ? convertToNextTailwind({ pages } as BuilderSchema)
        : convertToReactNative({ pages } as BuilderSchema)
    setLiveCode(code)
  }, [pages, platform])

  useEffect(() => generateLiveCode(), [generateLiveCode])

  // -------------------------
  // Write code to iframe with interactive handlers
  // -------------------------
  const writeIframe = useCallback(() => {
    if (!iframeRef.current) return
    const doc = iframeRef.current.contentDocument
    if (!doc) return

    const componentsData = JSON.stringify(page.components)
    const selectedIdsData = JSON.stringify(selectedIds)

    doc.open()
    doc.write(`
      <html>
      <head>
        <meta charset="UTF-8"/>
        <title>Figma-Grade Runtime</title>
        <style>
          body { margin:0; font-family:sans-serif; }
          #root { width:100vw; height:100vh; position:relative; background:#f9f9f9; }
          .component { position:absolute; border:1px solid #3b82f6; background:#dbeafe; border-radius:4px; display:flex; align-items:center; justify-content:center; user-select:none; cursor:pointer;}
          .selected { border-color:#ef4444; box-shadow:0 0 0 2px rgba(239,68,68,0.5);}
          .snap-line { position:absolute; background:#2563eb; z-index:999; }
          .spacing-hint { position:absolute; background:white; padding:1px 3px; font-size:10px; color:#374151; border-radius:2px; z-index:1000; pointer-events:none;}
        </style>
      </head>
      <body>
        <div id="root"></div>
        <script type="module">
          const components = ${componentsData};
          const selectedIds = ${selectedIdsData};
          const root = document.getElementById("root");

          const SNAP_THRESHOLD = 12;
          const gridSize = 8;

          function clearRoot(){
            root.innerHTML="";
          }

          function render(){
            clearRoot();

            const snapLines = [];
            const spacingHints = [];

            components.forEach(c=>{
              const el = document.createElement("div");
              el.id = c.id;
              el.className="component "+(selectedIds.includes(c.id)?"selected":"");
              el.style.left=(c.props.base?.x||0)+"px";
              el.style.top=(c.props.base?.y||0)+"px";
              el.style.width=(c.props.base?.width||100)+"px";
              el.style.height=(c.props.base?.height||40)+"px";
              el.innerText=c.props.base?.text||c.type;
              root.appendChild(el);

              // -------------------------
              // Drag & Resize
              // -------------------------
              let dragging=false, offsetX=0, offsetY=0;
              el.addEventListener("mousedown", e=>{
                dragging=true; offsetX=e.offsetX; offsetY=e.offsetY;
                parent.postMessage({type:"select", ids:[c.id]}, "*")
              });
              window.addEventListener("mousemove", e=>{
                if(!dragging) return;
                let x = e.clientX-offsetX;
                let y = e.clientY-offsetY;

                // Snap to other components
                components.forEach(other=>{
                  if(other.id===c.id) return;
                  const ox=other.props.base?.x||0;
                  const oy=other.props.base?.y||0;
                  if(Math.abs(x-ox)<SNAP_THRESHOLD) { snapLines.push({x:ox}); x=ox; }
                  if(Math.abs(y-oy)<SNAP_THRESHOLD) { snapLines.push({y:oy}); y=oy; }
                });

                // Snap to grid
                x = Math.round(x/gridSize)*gridSize;
                y = Math.round(y/gridSize)*gridSize;

                el.style.left = x+"px";
                el.style.top = y+"px";
                parent.postMessage({type:"dragging", id:c.id, x, y}, "*")
              });
              window.addEventListener("mouseup", e=>{
                if(dragging){
                  dragging=false;
                  const x = parseFloat(el.style.left);
                  const y = parseFloat(el.style.top);
                  parent.postMessage({type:"drag-end", id:c.id, x, y}, "*")
                }
              });
            });

            // Render snap lines
            snapLines.forEach(line=>{
              const div = document.createElement("div");
              div.className="snap-line";
              if(line.x!==undefined){ div.style.left=line.x+"px"; div.style.top="0px"; div.style.width="1px"; div.style.height="100%"; }
              if(line.y!==undefined){ div.style.top=line.y+"px"; div.style.left="0px"; div.style.height="1px"; div.style.width="100%"; }
              root.appendChild(div);
            });

            // Render spacing hints
            spacingHints.forEach(h=>{
              const div=document.createElement("div");
              div.className="spacing-hint";
              div.style.left=(h.x||0)+"px";
              div.style.top=(h.y||0)+"px";
              div.innerText = h.value+"px";
              root.appendChild(div);
            });
          }

          render();
        </script>
      </body>
      </html>
    `)
    doc.close()
  }, [page.components, selectedIds, platform])

  useEffect(()=>writeIframe(), [writeIframe])

  // -------------------------
  // Listen to iframe messages for drag, multi-select
  // -------------------------
  useEffect(()=>{
    const handleMessage=(e:MessageEvent)=>{
      const data=e.data;
      if(!data) return;

      if(data.type==="dragging" || data.type==="drag-end"){
        const updated = page.components.map(c=>{
          if(c.id===data.id){
            return {...c, props:{...c.props, base:{...c.props.base, x:data.x, y:data.y}}}
          }
          return c;
        });
        updateMultipleComponents(updated);
      }
      if(data.type==="select"){
        setSelection(data.ids);
      }
    }
    window.addEventListener("message", handleMessage)
    return ()=>window.removeEventListener("message", handleMessage)
  },[page.components, updateMultipleComponents, setSelection])

  return (
    <div className="flex flex-col w-full h-full gap-2">
      {/* Platform Toggle */}
      <div className="flex gap-2">
        <button className={`px-3 py-1 rounded ${platform==="nextjs"?"bg-blue-500 text-white":"bg-gray-200"}`} onClick={()=>setPlatform("nextjs")}>Next.js / Tailwind</button>
        <button className={`px-3 py-1 rounded ${platform==="reactnative"?"bg-green-500 text-white":"bg-gray-200"}`} onClick={()=>setPlatform("reactnative")}>React Native</button>
      </div>

      {/* Full WYSIWYG iframe */}
      <div className="flex-1 border rounded-lg overflow-hidden relative" style={{ transform:`scale(${zoom})`, transformOrigin:"top left" }}>
        <iframe ref={iframeRef} title="Figma Runtime Simulator" className="w-full h-full border-none" />
      </div>

      {/* Live Export Panel */}
      <ExportFeedbackPanel liveCode={liveCode} />
    </div>
  )
}

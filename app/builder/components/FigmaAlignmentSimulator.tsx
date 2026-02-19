//
//  FigmaAlignmentSimulator.tsx
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/17/26.
//


"use client"

import React, { useRef, useState, useEffect, useCallback } from "react"
import { useBuilderStore } from "../state/builderStore"
import { BuilderSchema, BuilderComponent } from "@lib/exporter/schema"
import { convertToNextTailwind, convertToReactNative } from "@/lib/exporter/codeGenerator"
import ExportFeedbackPanel from "./ExportFeedbackPanel"

interface FigmaAlignmentSimulatorProps {
  zoom?: number
}

export default function FigmaAlignmentSimulator({ zoom = 1 }: FigmaAlignmentSimulatorProps) {
  const { pages, selectedIds, setSelection, updateMultipleComponents } = useBuilderStore()
  const page = pages[0]
  const [platform, setPlatform] = useState<"nextjs" | "reactnative">("nextjs")
  const [liveCode, setLiveCode] = useState<string>("")
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const generateLiveCode = useCallback(() => {
    const code =
      platform === "nextjs"
        ? convertToNextTailwind({ pages } as BuilderSchema)
        : convertToReactNative({ pages } as BuilderSchema)
    setLiveCode(code)
  }, [pages, platform])

  useEffect(() => generateLiveCode(), [generateLiveCode])

  // -------------------------
  // Alignment Helpers
  // -------------------------
  const alignSelected = (direction: "left"|"right"|"top"|"bottom"|"hCenter"|"vCenter")=>{
    if(selectedIds.length<2) return
    const selected = page.components.filter(c=>selectedIds.includes(c.id))
    let updated = page.components.map(c=>{
      if(!selectedIds.includes(c.id)) return c
      let propsBase = {...c.props.base}
      const refComp = selected[0]
      switch(direction){
        case "left": propsBase.x=refComp.props.base?.x||0; break
        case "right": propsBase.x=(refComp.props.base?.x||0)+(refComp.props.base?.width||0)-(propsBase.width||100); break
        case "top": propsBase.y=refComp.props.base?.y||0; break
        case "bottom": propsBase.y=(refComp.props.base?.y||0)+(refComp.props.base?.height||0)-(propsBase.height||40); break
        case "hCenter": propsBase.x=(refComp.props.base?.x||0)+((refComp.props.base?.width||100)/2)-((propsBase.width||100)/2); break
        case "vCenter": propsBase.y=(refComp.props.base?.y||0)+((refComp.props.base?.height||40)/2)-((propsBase.height||40)/2); break
      }
      return {...c, props:{...c.props, base:propsBase}}
    })
    updateMultipleComponents(updated)
  }

  const distributeSelected = (axis:"horizontal"|"vertical")=>{
    if(selectedIds.length<3) return
    const selected = page.components.filter(c=>selectedIds.includes(c.id)).sort((a,b)=>axis==="horizontal"? (a.props.base?.x||0)-(b.props.base?.x||0) : (a.props.base?.y||0)-(b.props.base?.y||0))
    const first = selected[0], last=selected[selected.length-1]
    const spacing = axis==="horizontal"
      ? ((last.props.base?.x||0)-(first.props.base?.x||0))/(selected.length-1)
      : ((last.props.base?.y||0)-(first.props.base?.y||0))/(selected.length-1)

    let updated = page.components.map(c=>{
      if(!selectedIds.includes(c.id)) return c
      const idx=selected.findIndex(s=>s.id===c.id)
      let propsBase = {...c.props.base}
      if(axis==="horizontal") propsBase.x=(first.props.base?.x||0)+spacing*idx
      if(axis==="vertical") propsBase.y=(first.props.base?.y||0)+spacing*idx
      return {...c, props:{...c.props, base:propsBase}}
    })
    updateMultipleComponents(updated)
  }

  // -------------------------
  // Write iframe content
  // -------------------------
  const writeIframe = useCallback(()=>{
    if(!iframeRef.current) return
    const doc=iframeRef.current.contentDocument
    if(!doc) return

    const componentsData = JSON.stringify(page.components)
    const selectedIdsData = JSON.stringify(selectedIds)

    doc.open()
    doc.write(`
      <html>
      <head>
        <meta charset="UTF-8"/>
        <title>Figma Alignment Simulator</title>
        <style>
          body { margin:0; font-family:sans-serif; }
          #root { width:100vw; height:100vh; position:relative; background:#f9f9f9; }
          .component { position:absolute; border:1px solid #3b82f6; background:#dbeafe; border-radius:4px; display:flex; align-items:center; justify-content:center; user-select:none; cursor:pointer; }
          .selected { border-color:#ef4444; box-shadow:0 0 0 2px rgba(239,68,68,0.5);}
          .handle { width:8px; height:8px; background:#ef4444; position:absolute; z-index:10; cursor:se-resize; }
          .snap-line { position:absolute; background:#2563eb; z-index:999; }
        </style>
      </head>
      <body>
        <div id="root"></div>
        <script type="module">
          const components = ${componentsData};
          let selectedIds = ${selectedIdsData};
          const root=document.getElementById("root");
          const SNAP_THRESHOLD=12, GRID=8;

          function render(){
            root.innerHTML="";
            const snapLines=[];

            components.forEach(c=>{
              const el=document.createElement("div");
              el.id=c.id;
              el.className="component "+(selectedIds.includes(c.id)?"selected":"");
              el.style.left=(c.props.base?.x||0)+"px";
              el.style.top=(c.props.base?.y||0)+"px";
              el.style.width=(c.props.base?.width||100)+"px";
              el.style.height=(c.props.base?.height||40)+"px";
              el.innerText=c.props.base?.text||c.type;
              root.appendChild(el);

              const handle=document.createElement("div"); handle.className="handle"; handle.style.right="-4px"; handle.style.bottom="-4px"; el.appendChild(handle);

              let dragging=false, resizing=false, offsetX=0, offsetY=0, startW=0, startH=0;

              el.addEventListener("mousedown", e=>{
                if(e.target===handle){ resizing=true; startW=el.offsetWidth; startH=el.offsetHeight; offsetX=e.clientX; offsetY=e.clientY;}
                else{ dragging=true; offsetX=e.offsetX; offsetY=e.offsetY; parent.postMessage({type:"select", ids:[c.id]}, "*")}
              });

              window.addEventListener("mousemove", e=>{
                let x=el.offsetLeft, y=el.offsetTop, w=el.offsetWidth, h=el.offsetHeight;
                if(dragging){
                  x=e.clientX-offsetX; y=e.clientY-offsetY;
                  components.forEach(other=>{
                    if(other.id===c.id) return;
                    const ox=other.props.base?.x||0, oy=other.props.base?.y||0;
                    if(Math.abs(x-ox)<SNAP_THRESHOLD)x=ox;
                    if(Math.abs(y-oy)<SNAP_THRESHOLD)y=oy;
                  });
                  x=Math.round(x/GRID)*GRID; y=Math.round(y/GRID)*GRID;
                  el.style.left=x+"px"; el.style.top=y+"px";
                  parent.postMessage({type:"dragging", id:c.id, x, y}, "*")
                }
                if(resizing){
                  w=startW + (e.clientX-offsetX); h=startH + (e.clientY-offsetY);
                  if(c.layout?.fillWidth) w=el.parentElement.offsetWidth - parseFloat(el.style.left);
                  if(c.layout?.fillHeight) h=el.parentElement.offsetHeight - parseFloat(el.style.top);
                  el.style.width=w+"px"; el.style.height=h+"px";
                  parent.postMessage({type:"resize", id:c.id, width:w, height:h}, "*")
                }
              });

              window.addEventListener("mouseup", e=>{
                if(dragging){ dragging=false; const x=parseFloat(el.style.left), y=parseFloat(el.style.top); parent.postMessage({type:"drag-end", id:c.id, x, y}, "*") }
                if(resizing){ resizing=false; const w=parseFloat(el.style.width), h=parseFloat(el.style.height); parent.postMessage({type:"resize-end", id:c.id, width:w, height:h}, "*") }
              });
            });

            snapLines.forEach(line=>{
              const div=document.createElement("div"); div.className="snap-line";
              if(line.x!==undefined){ div.style.left=line.x+"px"; div.style.top="0"; div.style.width="1px"; div.style.height="100%"; }
              if(line.y!==undefined){ div.style.top=line.y+"px"; div.style.left="0"; div.style.height="1px"; div.style.width="100%"; }
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
  // Listen to iframe messages
  // -------------------------
  useEffect(()=>{
    const handleMessage=(e:MessageEvent)=>{
      const data=e.data
      if(!data) return
      const updated = page.components.map(c=>{
        if(c.id===data.id){
          const propsBase = {...c.props.base}
          if(data.type==="dragging"||data.type==="drag-end"){ propsBase.x=data.x; propsBase.y=data.y }
          if(data.type==="resize"||data.type==="resize-end"){ propsBase.width=data.width; propsBase.height=data.height }
          return {...c, props:{...c.props, base:propsBase}}
        }
        return c
      })
      updateMultipleComponents(updated)
      if(data.type==="select") setSelection(data.ids)
    }
    window.addEventListener("message", handleMessage)
    return ()=>window.removeEventListener("message", handleMessage)
  }, [page.components, updateMultipleComponents, setSelection])

  return (
    <div className="flex flex-col w-full h-full gap-2">
      {/* Alignment Toolbar */}
      <div className="flex gap-1">
        <button onClick={()=>alignSelected("left")} className="px-2 py-1 bg-gray-200 rounded">Align Left</button>
        <button onClick={()=>alignSelected("right")} className="px-2 py-1 bg-gray-200 rounded">Align Right</button>
        <button onClick={()=>alignSelected("top")} className="px-2 py-1 bg-gray-200 rounded">Align Top</button>
        <button onClick={()=>alignSelected("bottom")} className="px-2 py-1 bg-gray-200 rounded">Align Bottom</button>
        <button onClick={()=>alignSelected("hCenter")} className="px-2 py-1 bg-gray-200 rounded">Align H Center</button>
        <button onClick={()=>alignSelected("vCenter")} className="px-2 py-1 bg-gray-200 rounded">Align V Center</button>
        <button onClick={()=>distributeSelected("horizontal")} className="px-2 py-1 bg-gray-200 rounded">Distribute H</button>
        <button onClick={()=>distributeSelected("vertical")} className="px-2 py-1 bg-gray-200 rounded">Distribute V</button>
      </div>

      {/* Platform Toggle */}
      <div className="flex gap-2">
        <button className={`px-3 py-1 rounded ${platform==="nextjs"?"bg-blue-500 text-white":"bg-gray-200"}`} onClick={()=>setPlatform("nextjs")}>Next.js / Tailwind</button>
        <button className={`px-3 py-1 rounded ${platform==="reactnative"?"bg-green-500 text-white":"bg-gray-200"}`} onClick={()=>setPlatform("reactnative")}>React Native</button>
      </div>

      {/* Figma-Grade iframe */}
      <div className="flex-1 border rounded-lg overflow-hidden relative" style={{ transform:`scale(${zoom})`, transformOrigin:"top left" }}>
        <iframe ref={iframeRef} title="Figma Alignment Simulator" className="w-full h-full border-none" />
      </div>

      {/* Live Export Panel */}
      <ExportFeedbackPanel liveCode={liveCode} />
    </div>
  )
}

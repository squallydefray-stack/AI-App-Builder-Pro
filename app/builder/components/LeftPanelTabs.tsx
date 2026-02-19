//
//  LeftPanelTabs.tsx
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/17/26.
//


"use client"

import React, { useState } from "react"
import PageTree from "./PageTree"
import ComponentPanel from "./ComponentPanel"

export default function LeftPanelTabs() {
  const [activeTab, setActiveTab] = useState<"pages" | "components">("pages")

  return (
    <div className="flex flex-col h-full">
      {/* Tab Buttons */}
      <div className="flex border-b border-gray-300 bg-gray-100">
        <button
          className={`flex-1 py-2 font-medium ${
            activeTab === "pages" ? "bg-white border-b-2 border-blue-600" : ""
          }`}
          onClick={() => setActiveTab("pages")}
        >
          Pages
        </button>
        <button
          className={`flex-1 py-2 font-medium ${
            activeTab === "components" ? "bg-white border-b-2 border-blue-600" : ""
          }`}
          onClick={() => setActiveTab("components")}
        >
          Components
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto bg-white">
        {activeTab === "pages" && <PageTree />}
        {activeTab === "components" && <ComponentPanel />}
      </div>
    </div>
  )
}

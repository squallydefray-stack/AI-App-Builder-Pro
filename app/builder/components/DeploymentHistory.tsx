// app/builder/components/DeploymentHistory.tsx

"use client"
import React, { useState } from "react"
import LiveLogs from "./LiveLogs"

interface Deployment {
  id: string
  liveUrl: string
  timestamp: string
}

interface DeploymentHistoryProps {
  deployments: Deployment[]
}

export default function DeploymentHistory({ deployments }: DeploymentHistoryProps) {
  const [selectedDeployment, setSelectedDeployment] = useState<string | null>(null)

  return (
    <div className="mt-4 p-2 border-t border-neutral-800 space-y-2">
      <h2 className="text-sm font-semibold text-white mb-1">Deployment History</h2>

      {deployments.length === 0 && <p className="text-xs text-neutral-400">No deployments yet</p>}

      {deployments.map((d) => (
        <div key={d.id} className="flex flex-col border border-gray-700 rounded p-2">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-200">{new Date(d.timestamp).toLocaleString()}</span>
            <a href={d.liveUrl} target="_blank" className="text-xs text-blue-400 hover:underline">
              Live
            </a>
            <button
              onClick={() => setSelectedDeployment(selectedDeployment === d.id ? null : d.id)}
              className="text-xs text-gray-300 hover:text-white"
            >
              {selectedDeployment === d.id ? "Hide Logs" : "View Logs"}
            </button>
          </div>
          {selectedDeployment === d.id && <LiveLogs deploymentId={d.id} />}
        </div>
      ))}
    </div>
  )
}
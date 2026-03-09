//
//  vercelDeploy.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/21/26.
//


// lib/vercelDeploy.ts
import fetch from "node-fetch";

interface DeployOptions {
  projectName: string;
  githubRepo?: string;      // Optional, if linking to GitHub
  branch?: string;          // Branch to deploy
  directory?: string;       // Local directory path (relative to repo root)
}

interface VercelDeployResponse {
  url: string;
  id: string;
  state: string;
}

export async function vercelDeploy(options: DeployOptions): Promise<VercelDeployResponse> {
  const token = process.env.VERCEL_TOKEN;
  if (!token) throw new Error("VERCEL_TOKEN is not defined in environment variables");

  const body: unknown = {
    name: options.projectName,
    gitSource: options.githubRepo
      ? {
          type: "github",
          repo: options.githubRepo,
          ref: options.branch || "main",
        }
      : undefined,
    target: "production",
    rootDirectory: options.directory || "",
  };

  const response = await fetch("https://api.vercel.com/v13/deployments", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Vercel deployment failed: ${text}`);
  }

  const data = await response.json();
  return {
    url: data.url,
    id: data.id,
    state: data.state,
  };
}
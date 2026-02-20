// lib/vercel.ts
import axios from "axios";

interface DeployToVercelOptions {
  repoUrl: string;      // GitHub repository URL
  projectName: string;  // Unique Vercel project name
}

interface DeployToVercelResult {
  deploymentId: string;
  liveUrl: string;
}

export async function deployToVercel(
  { repoUrl, projectName }: DeployToVercelOptions
): Promise<DeployToVercelResult> {
  if (!process.env.VERCEL_TOKEN || !process.env.VERCEL_ORG_ID) {
    throw new Error("Missing VERCEL_TOKEN or VERCEL_ORG_ID environment variable");
  }

  // 1️⃣ Create a Vercel project
  const createProjectRes = await axios.post(
    "https://api.vercel.com/v9/projects",
    {
      name: projectName,
      gitRepository: {
        type: "github",
        repo: repoUrl.split("/").slice(-2).join("/").replace(".git", ""),
        productionBranch: "main",
      },
      framework: "nextjs",
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );

  const projectId = createProjectRes.data.id;
  if (!projectId) throw new Error("Failed to create Vercel project");

  // 2️⃣ Trigger a deployment
  const deployRes = await axios.post(
    `https://api.vercel.com/v13/deployments`,
    {
      name: projectName,
      gitSource: {
        type: "github",
        repoOrg: repoUrl.split("/").slice(-2, -1)[0],
        repoName: repoUrl.split("/").slice(-1)[0].replace(".git", ""),
        productionBranch: "main",
      },
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );

  const deploymentId = deployRes.data.id;
  const liveUrl = deployRes.data.url;

  if (!deploymentId || !liveUrl) {
    throw new Error("Vercel deployment failed");
  }

  console.log(`✅ Vercel deployment created: ${liveUrl} (ID: ${deploymentId})`);

  return { deploymentId, liveUrl };
}
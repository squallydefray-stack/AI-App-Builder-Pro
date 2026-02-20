// lib/deploy.ts
export async function getDeploymentStatus(deploymentId: string) {
  try {
    const res = await fetch(`/api/deploy/status?id=${deploymentId}`);
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to get deployment status");
    }
    return res.json();
  } catch (err: any) {
    console.error("Deployment status error:", err.message);
    return null;
  }
}
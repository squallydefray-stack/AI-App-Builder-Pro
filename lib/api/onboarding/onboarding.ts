// lib/onboarding.ts
export async function runOnboarding(userId: string) {
  try {
    const res = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: { id: userId } }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Onboarding failed");
    }

    const data = await res.json();
    return {
      workspace: data.workspace,
      project: data.project,
      githubRepo: data.githubRepo || null,
      vercelDeploymentUrl: data.vercelDeploymentUrl || null,
    };
  } catch (err: any) {
    console.error("Onboarding error:", err.message);
    return null;
  }
}
/* =============================
GITHUB EXPORT ROUTE
============================= */

import { NextResponse } from "next/server";
import { generateNextJS } from "@/lib/exporters/nextjs";
import { createGithubRepo } from "@/lib/github";
import { BuilderSchema } from "@/types/builder-schema";

export async function Get(req: Request) {
    try {
        const { schema, repoName } = await req.json();
        
        if (!schema?.pages || !repoName) {
            return NextResponse.json(
                                     { error: "Missing schema or repo name" },
                                     { status: 400 }
                                     );
        }
        
        const files = generateNextJS(schema);
        const repoUrl = await createGithubRepo(repoName, files);
        
        return NextResponse.json({
            success: true,
            repoUrl,
        });
    } catch (err) {
        console.error("GitHub export failed:", err);
        return NextResponse.json(
                                 { error: "GitHub export failed" },
                                 { status: 500 }
                                 );
    }
    fetch("/api/github/repos")
    .then(res => res.json())
    .then(data => console.log(data))
    }
}

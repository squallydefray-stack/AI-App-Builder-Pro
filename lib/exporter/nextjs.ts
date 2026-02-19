/* =============================
NEXT.JS EXPORT ROUTE
============================= */

import { NextResponse } from "next/server";
import { generateNextJS } from "@/lib/exporters/nextjs";
import { BuilderSchema } from "@/types/builder-schema";

/**
 * POST /api/export/nextjs
 * Body: BuilderSchema
 * Returns: Generated Next.js project files
 */
export async function POST(req: Request) {
  try {
    const schema: BuilderSchema = await req.json();

    if (!schema || !schema.pages) {
      return NextResponse.json(
        { error: "Invalid builder schema" },
        { status: 400 }
      );
    }

    const files = generateNextJS(schema);

    return NextResponse.json({
      framework: "nextjs",
      files,
    });
  } catch (error) {
    console.error("Next.js export failed:", error);
    return NextResponse.json(
      { error: "Failed to export Next.js project" },
      { status: 500 }
    );
  }
}

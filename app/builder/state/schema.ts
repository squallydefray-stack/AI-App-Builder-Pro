// Targets: Next.js (Web) + React Native (Mobile)


/* =============================
1. EXPORTER OVERVIEW
============================= */


// Input: BuilderSchema (JSON)
// Output: Runnable source code files
// Principle: Deterministic, readable, developer-owned code


/* =============================
2. BUILDER SCHEMA (INPUT)
============================= */


export type BuilderSchema = {
pages: PageSchema[];
};


export type PageSchema = {
id: string;
name: string;
components: BuilderComponent[];
};


export type BuilderComponent = {
id: string;
type: "Button" | "Input" | "Card" | "Text" | "Table" | "Form";
props: Record<string, any>;
style: Record<string, any>;
position: { x: number; y: number };
};


export type ResponsiveProps = {
  base: Record<string, any>
  tablet?: Record<string, any>
  mobile?: Record<string, any>
}

export type BuilderComponent = {
  id: string
  type: "Text" | "Button" | "Layout"
  props: ResponsiveProps
  children?: BuilderComponent[]
}
props: {
  base: { direction: "row", gap: 16 },
  mobile: { direction: "column", gap: 8 }
}
export type BuilderSchema = {
  pages: {
    id: string
    name: string
    components: BuilderComponent[]
  }[]
}

/* =============================
3. CODE GENERATION PIPELINE
============================= */


export function exportProject(schema: BuilderSchema) {
return {
web: generateNextJS(schema),
mobile: generateReactNative(schema)
};
}

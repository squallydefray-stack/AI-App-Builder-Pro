// This is the CORE of the visual builder


/* =============================
DATA MODEL (Builder Schema)
============================= */


export type BuilderComponent = {
id: string;
type: "Button" | "Input" | "Card" | "Text";
props: Record<string, any>;
style: Record<string, any>;
position: { x: number; y: number };
};

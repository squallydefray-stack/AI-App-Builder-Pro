/* =============================
3. SERVER ACTION (AI CALL)
============================= */


"use server";


import OpenAI from "openai";


const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });


export async function generateUI(prompt: string): Promise<BuilderSchema> {
const completion = await openai.chat.completions.create({
model: "gpt-4.1",
messages: [
{ role: "system", content: SYSTEM_PROMPT },
{ role: "user", content: prompt }
],
temperature: 0.3
});


const json = completion.choices[0].message.content!;
return JSON.parse(json);
}


/* =============================
4. APPLY AI OUTPUT TO CANVAS
============================= */


import { useBuilderStore } from "./store";


export function applySchema(schema: BuilderSchema) {
const page = schema.pages[0];
useBuilderStore.setState({ components: page.components });
}

/* =============================
5. AI PROMPT PANEL (UI)
============================= */


"use client";


import { useState } from "react";


export function AIPromptPanel() {
const [prompt, setPrompt] = useState("");
const [loading, setLoading] = useState(false);


async function run() {
setLoading(true);
const schema = await generateUI(prompt);
applySchema(schema);
setLoading(false);
}


return (
<div className="p-4 border-l h-full flex flex-col gap-3">
<h3 className="font-semibold">AI Assistant</h3>
<textarea
className="border p-2 rounded h-32"
placeholder="Build me a CRM dashboard"
value={prompt}
onChange={(e) => setPrompt(e.target.value)}
/>
<button
onClick={run}
disabled={loading}
className="bg-primary text-white py-2 rounded"
>
{loading ? "Generating…" : "Generate UI"}
</button>
</div>
);
}
/* =============================
6. EXAMPLE AI OUTPUT
============================= */


// Prompt: "Build a login page"
//
// {
// "pages": [
// {
// "id": "login",
// "name": "Login",
// "components": [
// {
// "id": "title",
// "type": "Text",
// "props": { "text": "Welcome Back" },
// "style": {},
// "position": { "x": 200, "y": 80 }
// },
// {
// "id": "email",
// "type": "Input",
// "props": { "placeholder": "Email" },
// "style": {},
// "position": { "x": 200, "y": 140 }
// },
// {
// "id": "password",
// "type": "Input",
// "props": { "placeholder": "Password" },
// "style": {},
// "position": { "x": 200, "y": 190 }
// },
// {
// "id": "login-btn",
// "type": "Button",
// "props": { "label": "Login" },
// "style": {},
// "position": { "x": 200, "y": 250 }
// }
// ]
// }
// ]
// }

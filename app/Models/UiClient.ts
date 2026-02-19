/* =============================
3. TEMPLATE UI (CLIENT)
============================= */
"use client";


import { useState, useEffect } from 'react';
import { templateRouter } from '@/server/api/templateRouter';


export function TemplateMarketplace() {
const [templates, setTemplates] = useState<any[]>([]);


useEffect(() => {
templateRouter.getTemplates.query().then(setTemplates);
}, []);


return (
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
{templates.map(t => (
<div key={t.id} className="border rounded p-4 hover:shadow-lg">
<h3 className="font-semibold text-lg">{t.name}</h3>
<p className="text-sm text-muted-foreground mt-2">{t.description}</p>
<div className="mt-4 flex gap-2">
<button className="bg-primary text-white py-2 px-4 rounded">Use Template</button>
{t.price && <span className="ml-auto font-medium">${t.price}</span>}
</div>
</div>
))}
</div>
);
}


/* =============================
4. FEATURES
============================= */
// • Browse free & paid templates
// • Publish your own templates to marketplace
// • Monetization support (price, purchases)
// • Featured templates highlighting
// • Tags for search and categorization
// • Can integrate AI → Template suggestion for users


/* =============================
END TEMPLATE & MARKETPLACE

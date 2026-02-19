/* =============================
PROPERTIES INSPECTOR
============================= */


export function PropertiesPanel() {
const { components, selectedId, updateComponent } = useBuilderStore();
const selected = components.find((c) => c.id === selectedId);


if (!selected) return <p>Select a component</p>;


return (
<div className="space-y-4">
<h4 className="font-semibold">{selected.type}</h4>
{selected.type === "Button" && (
<input
className="border p-2 w-full"
placeholder="Label"
value={selected.props.label || ""}
onChange={(e) =>
updateComponent(selected.id, {
props: { ...selected.props, label: e.target.value },
})
}
/>
)}
</div>
);
}
/* =============================
ARCHITECTURE NOTES
============================= */


// • Schema-first (exportable to JSON)
// • Drag → update position
// • Renderer maps schema → real React components
// • This feeds directly into AI + code generation


/* =============================
END CANVAS ENGINE
============================= */

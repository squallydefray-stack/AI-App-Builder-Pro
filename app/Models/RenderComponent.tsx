/* =============================
COMPONENT RENDERER
============================= */


function RenderComponent({ component }: { component: BuilderComponent }) {
switch (component.type) {
case "Button":
return <button className="px-4 py-2 rounded bg-primary text-white">{component.props.label || "Button"}</button>;
case "Input":
return <input className="border px-3 py-2 rounded" placeholder={component.props.placeholder || "Input"} />;
case "Card":
return <div className="p-4 rounded border bg-background">Card</div>;
case "Text":
return <span>{component.props.text || "Text"}</span>;
default:
return null;
}
}

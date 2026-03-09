/* =============================
5. REACT NATIVE EXPORTER
============================= */


function generateReactNative(schema: BuilderSchema) {
const files: Record<string, string> = {};


schema.pages.forEach((page) => {
const jsx = page.components.map(renderMobileComponent).join("\n");


files[`screens/${page.name}Screen.tsx`] = `
import { View, Text, Button, TextInput } from 'react-native';


export default function ${page.name}Screen() {
return (
<View style={{ padding: 24 }}>
${jsx}
</View>
);
}`;
});


return files;
}


function renderMobileComponent(c: BuilderComponent) {
switch (c.type) {
case "Text":
return `<Text>${c.props.text || "Text"}</Text>`;
case "Button":
return `<Button title="${c.props.label || "Button"}" />`;
case "Input":
return `<TextInput placeholder="${c.props.placeholder || ""}" />`;
case "Card":
return `<View style={{ padding: 16, borderWidth: 1 }}><Text>Card</Text></View>`;
default:
return ``;
}
}


/* =============================
6. EXPORT DELIVERY
============================= */


// • ZIP download
// • Push to GitHub repo
// • Sync to local IDE


/* =============================
7. WHY THIS IS CRITICAL
============================= */


// • User owns code forever
// • No platform lock-in
// • Enterprise adoption enabler
// • Trust multiplier


/* =============================
END CODE EXPORTER
============================= */
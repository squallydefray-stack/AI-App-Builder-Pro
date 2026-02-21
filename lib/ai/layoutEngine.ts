// lib/ai/layoutEngine.ts
import { BuilderComponent, ResponsiveProps } from "@lib/exporter/schema";
import { serializeStyles } from "../exporter/styleSerializer";

/**
 * AI-Smart Layout Engine v2
 * Adds predictive container wrapping and live resizing hints
 */
export const analyzeLayout = (components: BuilderComponent[]): BuilderComponent[] => {
  return components.map((comp) => {
    const newComp: BuilderComponent = { ...comp };

    if (!newComp.responsiveProps) newComp.responsiveProps = { base: {} };
    const rp: ResponsiveProps = newComp.responsiveProps;

    // --- Flex / Gap ---
    if (newComp.children && newComp.children.length > 0) {
      const totalChildWidth = newComp.children.reduce((acc, c) => {
        const w = c.responsiveProps?.base?.width;
        if (!w) return acc;
        if (w.endsWith("%")) return acc + parseFloat(w);
        return acc; // For Tailwind fractions, ignore for now
      }, 0);

      rp.base.flexDirection = totalChildWidth > 100 ? "column" : "row";
      rp.base.gap = "8px";
      rp.base.flexWrap = totalChildWidth > 100 ? "wrap" : "nowrap";

      // Predictive container split: if children overflow, wrap to new container
      if (totalChildWidth > 100) {
        const wrappedChildren = [];
        let row: BuilderComponent[] = [];
        let rowWidth = 0;

        for (const child of newComp.children) {
          let childWidth = 0;
          const w = child.responsiveProps?.base?.width;
          if (w?.endsWith("%")) childWidth = parseFloat(w);
          else childWidth = 0;

          if (rowWidth + childWidth > 100) {
            wrappedChildren.push({ id: `${newComp.id}-wrap-${wrappedChildren.length}`, type: "container", children: row, responsiveProps: { base: { flexDirection: "row", gap: "8px", flexWrap: "nowrap" } } });
            row = [child];
            rowWidth = childWidth;
          } else {
            row.push(child);
            rowWidth += childWidth;
          }
        }

        if (row.length > 0) {
          wrappedChildren.push({ id: `${newComp.id}-wrap-${wrappedChildren.length}`, type: "container", children: row, responsiveProps: { base: { flexDirection: "row", gap: "8px", flexWrap: "nowrap" } } });
        }

        newComp.children = wrappedChildren;
      }

      // Recurse into children
      newComp.children = analyzeLayout(newComp.children);
    }

    // --- Tailwind-safe width snapping ---
    if (rp.base.width) {
      if (rp.base.width === "50%") rp.base.width = "50%";
      else if (rp.base.width === "33%") rp.base.width = "1/3";
      else if (rp.base.width === "100%") rp.base.width = "full";
    }

    // Responsive fallbacks
    if (!rp.tablet) rp.tablet = { width: "full" };
    if (!rp.mobile) rp.mobile = { width: "full" };

    // Serialize Tailwind classes for NodeRenderer / Export
    newComp.className = serializeStyles(rp);

    return newComp;
  });
};


export type LayoutSuggestion = {
  parentId: string | null
  direction: "row" | "column"
  gap: number
}

/**
 * Auto-layout the schema: apply suggestions to components
 */
export function autoLayoutSchema(components: BuilderComponent[]): BuilderComponent[] {
  const suggestions = analyzeLayout(components)

  suggestions.forEach((s) => {
    const parent = findComponentById(components, s.parentId)
    if (parent && parent.children) {
      parent.layout = {
        ...parent.layout,
        display: "flex",
        direction: s.direction,
        gap: s.gap,
      }

      // Auto-adjust child widths if row layout
      if (s.direction === "row") {
        const width = `${100 / parent.children.length}%`
        parent.children.forEach((child) => {
          child.props.base = { ...child.props.base, width }
        })
      }
    }
  })

  return components
}

/**
 * Helper: find component by id recursively
 */
function findComponentById(components: BuilderComponent[], id: string | null): BuilderComponent | null {
  if (!id) return null
  for (const c of components) {
    if (c.id === id) return c
    if (c.children?.length) {
      const found = findComponentById(c.children, id)
      if (found) return found
    }
  }
  return null
}

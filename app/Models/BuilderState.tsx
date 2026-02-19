/* =============================
STATE STORE (Zustand)
============================= */


import { create } from "zustand";


interface BuilderState {
components: BuilderComponent[];
selectedId: string | null;
addComponent: (c: BuilderComponent) => void;
updateComponent: (id: string, data: Partial<BuilderComponent>) => void;
selectComponent: (id: string | null) => void;
}


export const useBuilderStore = create<BuilderState>((set) => ({
components: [],
    collapsedIds: {},

    toggleCollapse: (id) =>
      set((state) => ({
        collapsedIds: {
          ...state.collapsedIds,
          [id]: !state.collapsedIds[id],
        },
      })),

selectedId: null,
addComponent: (c) => set((s) => ({ components: [...s.components, c] })),
updateComponent: (id, data) =>
set((s) => ({
components: s.components.map((c) =>
c.id === id ? { ...c, ...data } : c
),
})),
selectComponent: (id) => set({ selectedId: id }),
}));


/* =============================
CANVAS COMPONENT
============================= */


import { useBuilderStore } from "./store";
import { useCallback } from "react";

type BuilderState = {
    schema: BuilderSchema
    selectedId: string | null
    breakpoint: Breakpoint
    past: BuilderSchema[]          // Undo stack
    future: BuilderSchema[]        // Redo stack
    setComponents: (components: BuilderComponent[]) => void
}
    // Inside BuilderState
    dropTargetId: string | null
    setDropTarget: (id: string | null) => void
    dropTargetId: null,
    setDropTarget: (id) => set({ dropTargetId: id }),
    hoveredId: null,
    setHovered: (id: string | null) => set({ hoveredId: id }),
  // Core actions
  addComponent: (component: BuilderComponent) => void
  selectComponent: (id: string) => void
  updateComponent: (
    id: string,
    props: Record<string, any>,
    bp?: Breakpoint
  ) => void
  reorderComponents: (activeId: string, overId: string) => void
  moveComponentInto: (activeId: string, targetId: string) => void
  setBreakpoint: (bp: Breakpoint) => void

  // History actions
  undo: () => void
  redo: () => void
}
collapsedIds: Record<string, boolean>
toggleCollapse: (id: string) => void



type BuilderState = {
  schema: BuilderSchema
  selectedId: string | null
  breakpoint: Breakpoint

  // 👇 ADD THIS
  setComponents: (components: BuilderComponent[]) => void

  ...
}

export function BuilderCanvas() {
const { components, updateComponent, selectComponent } = useBuilderStore();


const onDrag = useCallback((id: string, x: number, y: number) => {
updateComponent(id, { position: { x, y } });
}, [updateComponent]);


return (
<div className="relative w-full h-full bg-muted/40 overflow-hidden">
{components.map((c) => (
<div
key={c.id}
className="absolute cursor-move"
style={{ left: c.position.x, top: c.position.y }}
onMouseDown={() => selectComponent(c.id)}
draggable
onDragEnd={(e) => onDrag(c.id, e.clientX, e.clientY)}
>
<RenderComponent component={c} />
</div>
))}
</div>
);
}

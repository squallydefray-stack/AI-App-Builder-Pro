//
//  useLiveAI.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/16/26.
//


// app/builder/hooks/useLiveAI.ts
import { useEffect, useRef } from "react";
import { useBuilderStore } from "@/state/builderStore";
import { analyzeLayout } from "@lib/ai/layoutEngine";
import { BuilderComponent } from "@lib/exporter/schema";

export const useLiveAI = (draggingId: string | null) => {
  const { pages, activePageId, updateMultipleComponents } = useBuilderStore();
  const frame = useRef<number>();

  useEffect(() => {
    if (!draggingId) return;

    const tick = () => {
      const page = pages.find((p) => p.id === activePageId);
      if (!page) return;

      const newComponents: BuilderComponent[] = analyzeLayout([...page.components]);
      updateMultipleComponents(newComponents);

      frame.current = requestAnimationFrame(tick);
    };

    frame.current = requestAnimationFrame(tick);
    return () => frame.current && cancelAnimationFrame(frame.current);
  }, [draggingId, pages, activePageId, updateMultipleComponents]);
};

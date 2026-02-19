//
//  AISuggestionsPanel.tsx
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/16/26.
//


// app/builder/components/AISuggestionsPanel.tsx
import { useBuilderStore } from "../state/builderStore";
import { analyzeLayout } from "@lib/ai/layoutEngine";

export const AISuggestionsPanel: React.FC = () => {
  const { pages, activePageId, updateMultipleComponents } = useBuilderStore();
  const page = pages.find(p => p.id === activePageId);

  const handleApplySuggestion = () => {
    if (!page) return;
    const newLayout = analyzeLayout([...page.components]);
    updateMultipleComponents(newLayout);
  };

  return (
    <div className="p-2 border-t border-gray-200 flex gap-2">
      <button
        className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
        onClick={handleApplySuggestion}
      >
        Apply AI Layout Suggestion
      </button>
    </div>
  );
};

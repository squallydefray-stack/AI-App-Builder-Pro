// builder/hooks/useDropIndicator.ts
import { useBuilderStore } from "@/builder/store"

export function useDropIndicator(id: string) {
  const { activeDragId, components } = useBuilderStore()

  if (!activeDragId) return null

  const valid =
    activeDragId !== id &&
    !components.isDescendant(activeDragId, id)

  return {
    isActive: true,
    isValid: valid
  }
}

//
//  snapResistance.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/23/26.
//


// lib/utils/snapResistance.ts

export function applyResistance(
  delta: number,
  threshold: number
): number {
  const distance = Math.abs(delta)

  if (distance > threshold) return delta

  const strength = 1 - distance / threshold
  return delta * strength
}
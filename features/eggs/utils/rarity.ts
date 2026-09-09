import type { EggRarity } from "../types"

export const RARITY_LABELS: Record<EggRarity, string> = {
  common: "Common",
  uncommon: "Uncommon",
  rare: "Rare",
  epic: "Epic",
  legendary: "Legendary",
}

function foundByShare(percent: number): string {
  return `Found by ${percent < 0.1 ? "less than 0.1" : percent}% of snaccers`
}

/** For eggs the viewer has found; 0% means they got there before anyone else. */
export function foundByLine(percent: number): string {
  if (percent <= 0) return "You found it first."
  return foundByShare(percent)
}

/** For still-hidden eggs; 0% just means nobody has it yet. */
export function mysteryFoundLine(percent: number): string {
  if (percent <= 0) return "No one has found this yet."
  return foundByShare(percent)
}

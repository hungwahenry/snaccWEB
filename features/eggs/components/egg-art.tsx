import { EggIcon } from "lucide-react"
import type { DiscoveredEgg, EggRarity } from "../types"
import { RARITY_LABELS } from "../utils/rarity"

export function EggArt({
  egg,
  size,
}: {
  egg: Pick<DiscoveredEgg, "image_url" | "color">
  size: number
}) {
  if (egg.image_url) {
    return (
      <img
        src={egg.image_url}
        alt=""
        className="shrink-0 rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    )
  }

  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full"
      style={{ width: size, height: size, backgroundColor: `${egg.color}26` }}
    >
      <EggIcon
        size={size * 0.45}
        color={egg.color}
        strokeWidth={1.75}
        aria-hidden
      />
    </span>
  )
}

export function RarityChip({
  rarity,
  color,
}: {
  rarity: EggRarity
  color: string
}) {
  return (
    <span
      className="shrink-0 rounded-full px-3 py-1 text-xs font-bold tracking-wide text-white uppercase"
      style={{ backgroundColor: color }}
    >
      {RARITY_LABELS[rarity]}
    </span>
  )
}

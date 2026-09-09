import { EggIcon } from "lucide-react"
import { timeAgo } from "@/lib/format"
import type { DiscoveredEgg, EggStub } from "../types"
import { foundByLine, mysteryFoundLine } from "../utils/rarity"
import { EggArt, RarityChip } from "./egg-art"

export function FoundRow({ egg }: { egg: DiscoveredEgg }) {
  return (
    <div className="flex items-center gap-3 border-b border-border px-6 py-3">
      <EggArt egg={egg} size={48} />

      <div className="flex flex-1 flex-col gap-0.5">
        <p className="font-bold">{egg.name}</p>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {egg.description}
        </p>
        <p className="text-xs text-muted-foreground">
          {foundByLine(egg.found_percent)} · {timeAgo(egg.discovered_at)}
        </p>
      </div>

      <RarityChip rarity={egg.rarity} color={egg.color} />
    </div>
  )
}

export function MysteryRow({ egg }: { egg: EggStub }) {
  return (
    <div className="flex items-center gap-3 border-b border-border px-6 py-3">
      <span
        className="flex size-12 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: `${egg.color}22` }}
      >
        <EggIcon size={20} color={egg.color} strokeWidth={1.75} aria-hidden />
      </span>

      <div className="flex flex-1 flex-col gap-0.5">
        <p className="font-bold">???</p>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {egg.hint ?? "No hints for this one."}
        </p>
        <p className="text-xs text-muted-foreground">
          {mysteryFoundLine(egg.found_percent)}
        </p>
      </div>

      <RarityChip rarity={egg.rarity} color={egg.color} />
    </div>
  )
}

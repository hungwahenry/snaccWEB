import { cn } from "@/lib/utils"
import type { StickerPack } from "../types"
import { coverUrlOf } from "../utils/packs"
import { PackCover } from "./pack-cover"
import { PremiumChip } from "./premium-chip"
import { TakenDownChip } from "./taken-down-chip"

export function PackSummary({
  pack,
  details,
  compact = false,
}: {
  pack: StickerPack
  details: string
  compact?: boolean
}) {
  return (
    <>
      <PackCover
        url={coverUrlOf(pack)}
        className={cn("rounded-xl", compact ? "size-11" : "size-14")}
      />
      <span className="flex min-w-0 flex-1 flex-col text-left">
        <span className="flex items-center gap-1.5">
          <span className="truncate font-extrabold text-foreground">
            {pack.title}
          </span>
          {pack.premium ? <PremiumChip /> : null}
          {pack.status === "taken_down" ? <TakenDownChip /> : null}
        </span>
        <span className="block truncate text-sm text-muted-foreground">
          {details}
        </span>
      </span>
    </>
  )
}

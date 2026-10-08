import type { ReactNode } from "react"
import type { StickerPack } from "../types"
import { coverUrlOf, packSummary } from "../utils/packs"
import { PackCover } from "./pack-cover"
import { PremiumChip } from "./premium-chip"

export function PackHero({
  pack,
  children,
}: {
  pack: StickerPack
  children?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 pt-6 pb-5 text-center">
      <PackCover url={coverUrlOf(pack)} className="size-24 rounded-3xl" />
      <div className="flex min-w-0 flex-col items-center gap-1">
        <h2 className="text-xl font-extrabold tracking-tight break-words text-foreground">
          {pack.title}
        </h2>
        <p className="text-sm text-muted-foreground">{packSummary(pack)}</p>
        {pack.premium ? <PremiumChip /> : null}
      </div>
      {children ? (
        <div className="flex flex-wrap justify-center gap-2">{children}</div>
      ) : null}
    </div>
  )
}

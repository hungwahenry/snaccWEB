import Link from "next/link"
import type { ReactNode } from "react"
import { stickerPackPath } from "../routes"
import type { StickerPack } from "../types"
import { coverUrlOf, packSummary } from "../utils/packs"
import { PackCover } from "./pack-cover"
import { PremiumChip } from "./premium-chip"

export function PackRow({
  pack,
  trailing,
}: {
  pack: StickerPack
  trailing?: ReactNode
}) {
  const href = stickerPackPath(pack.id)

  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <Link href={href} tabIndex={-1} aria-hidden className="shrink-0">
        <PackCover url={coverUrlOf(pack)} className="size-14" />
      </Link>

      <Link href={href} className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <span className="truncate font-extrabold text-foreground">
            {pack.title}
          </span>
          {pack.premium ? <PremiumChip /> : null}
        </span>
        <span className="block truncate text-sm text-muted-foreground">
          {packSummary(pack)}
        </span>
      </Link>

      {trailing}
    </div>
  )
}

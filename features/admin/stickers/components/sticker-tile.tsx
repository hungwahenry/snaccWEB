import type { ReactNode } from "react"
import { StickerImage } from "@/features/admin/shell/components/sticker-image"
import type { PackSticker } from "../types"
import { stickerBadges, stickerNote, stickerSrc } from "../utils/packs"
import { PackBadges } from "./pack-badges"

export function StickerTile({
  sticker,
  controls,
}: {
  sticker: PackSticker
  controls?: ReactNode
}) {
  const note = stickerNote(sticker)
  const badges = stickerBadges(sticker)

  return (
    <li className="flex min-w-0 flex-col gap-2 rounded-lg border p-2">
      <div className="relative">
        <StickerImage
          src={stickerSrc(sticker)}
          alt="Sticker"
          className="w-full border-0 p-2"
        />
        {badges.length > 0 ? (
          <div className="absolute top-1 left-1">
            <PackBadges badges={badges} />
          </div>
        ) : null}
      </div>
      {note ? (
        <p className="truncate text-xs text-muted-foreground">{note}</p>
      ) : null}
      {controls ? (
        <div className="flex items-center justify-between gap-1">
          {controls}
        </div>
      ) : null}
    </li>
  )
}

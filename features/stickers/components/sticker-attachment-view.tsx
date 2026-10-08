"use client"

import { StickerIcon } from "lucide-react"
import Link from "next/link"
import { useFlag } from "@/features/config/hooks/use-flag"
import { cn } from "@/lib/utils"
import { stickerPackPath } from "../routes"
import type { StickerAttachment } from "../types"
import { stickerBox } from "../utils/size"
import { StickerImage } from "./sticker-image"

const ROOM_FOR_WORDS = 96

export function StickerAttachmentView({
  sticker,
  size,
  openable = true,
  className,
  onHold,
}: {
  sticker: StickerAttachment
  size: number
  openable?: boolean
  className?: string
  onHold?: () => void
}) {
  const stickersOn = useFlag("stickers")

  if (sticker.removed || !sticker.url) {
    return (
      <span
        role="img"
        aria-label="Sticker removed"
        style={stickerBox(sticker, size)}
        className={cn(
          "flex shrink-0 flex-col items-center justify-center gap-1 self-start rounded-2xl border border-dashed border-border text-muted-foreground",
          className
        )}
      >
        <StickerIcon className="size-4" aria-hidden />
        {size >= ROOM_FOR_WORDS ? (
          <span className="text-xs">Sticker removed</span>
        ) : null}
      </span>
    )
  }

  const packId = openable && stickersOn ? sticker.pack_id : null
  const image = (
    <StickerImage
      sticker={{
        url: sticker.url,
        width: sticker.width,
        height: sticker.height,
      }}
      size={size}
      className={packId ? undefined : className}
      onHold={onHold}
    />
  )

  if (!packId) return image

  return (
    <Link
      href={stickerPackPath(packId)}
      aria-label="Open this sticker's pack"
      onClick={(event) => event.stopPropagation()}
      className={cn(
        "self-start rounded-2xl transition-opacity outline-none hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
    >
      {image}
    </Link>
  )
}

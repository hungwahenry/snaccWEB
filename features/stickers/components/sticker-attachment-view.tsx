"use client"

import { useHoldAction } from "@/hooks/use-hold-action"
import { cn } from "@/lib/utils"

interface StickerVisual {
  url: string
  width: number
  height: number
}

export function StickerAttachmentView({
  sticker,
  size,
  className,
  onHold,
}: {
  sticker: StickerVisual
  size: number
  className?: string
  onHold?: () => void
}) {
  const hold = useHoldAction(onHold)
  const ratio = sticker.height > 0 ? sticker.width / sticker.height : 1
  const width = ratio >= 1 ? size : size * ratio

  return (
    <img
      {...hold}
      src={sticker.url}
      alt="Sticker"
      draggable={false}
      style={{ width, height: width / ratio }}
      className={cn(
        "self-start object-contain [@media(pointer:coarse)]:select-none",
        className
      )}
    />
  )
}

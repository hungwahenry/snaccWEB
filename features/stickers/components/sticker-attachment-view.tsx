"use client"

import { useHoldAction } from "@/hooks/use-hold-action"
import { cn } from "@/lib/utils"
import { stickerBox } from "../utils/size"

export function StickerAttachmentView({
  sticker,
  size,
  className,
  onHold,
}: {
  sticker: { url: string; width: number; height: number }
  size: number
  className?: string
  onHold?: () => void
}) {
  const hold = useHoldAction(onHold)

  return (
    <img
      {...hold}
      src={sticker.url}
      alt="Sticker"
      draggable={false}
      style={stickerBox(sticker, size)}
      className={cn(
        "self-start object-contain [@media(pointer:coarse)]:select-none",
        className
      )}
    />
  )
}

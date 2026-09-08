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
}: {
  sticker: StickerVisual
  size: number
  className?: string
}) {
  const ratio = sticker.height > 0 ? sticker.width / sticker.height : 1
  const width = ratio >= 1 ? size : size * ratio

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={sticker.url}
      alt="Sticker"
      draggable={false}
      style={{ width, height: width / ratio }}
      className={cn("self-start object-contain", className)}
    />
  )
}

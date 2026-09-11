"use client"

import { ActionSheet } from "@/components/ui/action-sheet"
import { StickerTray } from "../components/sticker-tray"
import {
  useStickerTray,
  type StickerTrayOptions,
} from "../hooks/use-sticker-tray"

export type StickerTraySheetProps = StickerTrayOptions & {
  onCreateSticker?: () => void
}

export function StickerTraySheet({
  onCreateSticker,
  ...options
}: StickerTraySheetProps) {
  const { title, ...tray } = useStickerTray(options)

  return (
    <ActionSheet
      open={options.open}
      onOpenChange={options.onOpenChange}
      title={title}
      tall
      className="pb-4"
    >
      <StickerTray {...tray} onCreateSticker={onCreateSticker} />
    </ActionSheet>
  )
}

"use client"

import { ActionSheet } from "@/components/ui/action-sheet"
import { StickerCreator } from "../components/sticker-creator"
import { StickerTray } from "../components/sticker-tray"
import {
  useStickerTray,
  type StickerTrayOptions,
} from "../hooks/use-sticker-tray"

export function StickerTraySheet(options: StickerTrayOptions) {
  const { title, creator, ...tray } = useStickerTray(options)

  return (
    <>
      <ActionSheet
        open={options.open}
        onOpenChange={options.onOpenChange}
        title={title}
        tall
        className="pb-4"
      >
        <StickerTray {...tray} />
      </ActionSheet>
      <StickerCreator {...creator} />
    </>
  )
}

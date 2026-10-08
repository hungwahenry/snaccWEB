"use client"

import { ActionSheet } from "@/components/ui/action-sheet"
import { StickerCreator } from "../components/sticker-creator"
import { StickerPicker } from "../components/sticker-picker"
import {
  useStickerPicker,
  type StickerPickerOptions,
} from "../hooks/use-sticker-picker"

export function StickerPickerSheet(options: StickerPickerOptions) {
  const { title, creator, ...picker } = useStickerPicker(options)

  return (
    <>
      <ActionSheet
        open={options.open}
        onOpenChange={options.onOpenChange}
        label={title}
        tall
        className="flex flex-col overflow-y-hidden p-0"
      >
        <StickerPicker {...picker} />
      </ActionSheet>
      <StickerCreator {...creator} />
    </>
  )
}

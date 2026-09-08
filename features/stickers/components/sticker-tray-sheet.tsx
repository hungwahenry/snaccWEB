"use client"

import {
  HeartIcon,
  PlusIcon,
  SearchIcon,
  StickerIcon,
  WandSparklesIcon,
} from "lucide-react"
import { ActionSheet } from "@/components/ui/action-sheet"
import { Input } from "@/components/ui/input"
import { PillTabs, type PillTab } from "@/components/ui/pill-tabs"
import type { Gif } from "@/features/giphy/types"
import { useStickerTray, type TrayTab } from "../hooks/use-sticker-tray"
import type { Sticker } from "../types"
import { TrayGrid } from "./tray-grid"

export type StickerTraySheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onPickSticker?: (sticker: Sticker) => void
  onPickGif?: (gif: Gif) => void
  onCreateSticker?: () => void
}

export function StickerTraySheet({
  open,
  onOpenChange,
  onPickSticker,
  onPickGif,
  onCreateSticker,
}: StickerTraySheetProps) {
  return (
    <ActionSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Stickers"
      tall
      className="pb-4"
    >
      <TrayBody
        onPickSticker={onPickSticker}
        onPickGif={onPickGif}
        onCreateSticker={onCreateSticker}
        close={() => onOpenChange(false)}
      />
    </ActionSheet>
  )
}

function TrayBody(props: {
  onPickSticker?: (sticker: Sticker) => void
  onPickGif?: (gif: Gif) => void
  onCreateSticker?: () => void
  close: () => void
}) {
  const tray = useStickerTray(props)

  const tabs: PillTab<TrayTab>[] = [
    ...(tray.stickersEnabled
      ? [{ value: "stickers", label: "Stickers", icon: StickerIcon } as const]
      : []),
    ...(tray.gifsEnabled
      ? [{ value: "gifs", label: "GIFs", icon: WandSparklesIcon } as const]
      : []),
    ...(tray.stickersEnabled
      ? [{ value: "mine", label: "Mine", icon: HeartIcon } as const]
      : []),
  ]

  return (
    <div className="flex flex-col">
      <PillTabs tabs={tabs} value={tray.tab} onChange={tray.pickTab} />

      {tray.showSearch ? (
        <div className="px-4 py-2">
          <div className="relative">
            <SearchIcon className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={tray.query}
              onChange={(event) => tray.setQuery(event.target.value)}
              placeholder={tray.searchPlaceholder}
              autoCapitalize="none"
              autoCorrect="off"
              className="h-14 rounded-full pl-11 text-base md:text-base"
            />
          </div>
        </div>
      ) : null}

      {tray.tab === "mine" && props.onCreateSticker ? (
        <div className="px-4 py-2">
          <button
            type="button"
            onClick={props.onCreateSticker}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-border py-3 font-bold text-foreground transition-opacity active:opacity-70"
          >
            <PlusIcon className="size-5" /> Create a sticker
          </button>
        </div>
      ) : null}

      <TrayGrid grid={tray.grid} />

      <p className="pt-4 text-center text-[11px] font-bold tracking-wide text-muted-foreground uppercase">
        Powered by GIPHY
      </p>
    </div>
  )
}

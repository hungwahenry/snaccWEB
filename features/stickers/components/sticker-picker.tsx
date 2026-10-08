import type { RefObject } from "react"
import type { Gif } from "@/features/giphy/types"
import { PickerBar, type PickerBarProps } from "./picker-bar"
import { PickerGifGrid } from "./picker-gif-grid"
import { PickerRows, type PickerRowsProps } from "./picker-rows"
import { PickerSearch, type PickerSearchProps } from "./picker-search"

export interface StickerPickerProps {
  listRef: RefObject<HTMLDivElement | null>
  onScroll: () => void
  bar: PickerBarProps
  search: PickerSearchProps
  stickers: PickerRowsProps | null
  gifs: {
    items: Gif[]
    loading: boolean
    failed: boolean
    retry: () => void
    onPick: (gif: Gif) => void
  } | null
}

export function StickerPicker({
  listRef,
  onScroll,
  bar,
  search,
  stickers,
  gifs,
}: StickerPickerProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PickerBar {...bar} />
      <div
        ref={listRef}
        onScroll={onScroll}
        className="min-h-0 flex-1 overflow-y-auto"
      >
        <PickerSearch {...search} />
        {stickers ? <PickerRows {...stickers} /> : null}
        {gifs ? (
          <PickerGifGrid
            items={gifs.items}
            loading={gifs.loading}
            failed={gifs.failed}
            onRetry={gifs.retry}
            onPick={gifs.onPick}
          />
        ) : null}
      </div>
    </div>
  )
}

"use client"

import { PlusIcon, SearchIcon, XIcon } from "lucide-react"
import { IconButton } from "@/components/ui/icon-button"
import { Input } from "@/components/ui/input"
import { PillTabs, type PillTab } from "@/components/ui/pill-tabs"
import { GiphyAttribution } from "@/features/giphy/components/giphy-attribution"
import type { TrayGridState, TrayTab } from "../types"
import { TrayGrid } from "./tray-grid"

export type StickerTrayProps = {
  tabs: PillTab<TrayTab>[]
  tab: TrayTab
  onTabChange: (tab: TrayTab) => void
  query: string
  onQueryChange: (query: string) => void
  searchPlaceholder: string | null
  showAttribution: boolean
  grid: TrayGridState
  onCreateSticker?: () => void
}

export function StickerTray({
  tabs,
  tab,
  onTabChange,
  query,
  onQueryChange,
  searchPlaceholder,
  showAttribution,
  grid,
  onCreateSticker,
}: StickerTrayProps) {
  return (
    <div className="flex flex-col">
      {tabs.length > 1 ? (
        <PillTabs tabs={tabs} value={tab} onChange={onTabChange} />
      ) : null}

      {searchPlaceholder ? (
        <div className="px-4 py-2">
          <div className="relative">
            <SearchIcon
              aria-hidden
              className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              type="search"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              autoCapitalize="none"
              autoCorrect="off"
              enterKeyHint="search"
              className="h-14 rounded-full pr-12 pl-11 text-base md:text-base [&::-webkit-search-cancel-button]:hidden"
            />
            {query ? (
              <IconButton
                icon={XIcon}
                label="Clear search"
                onClick={() => onQueryChange("")}
                className="absolute top-1/2 right-2.5 -translate-y-1/2 text-muted-foreground"
                iconClassName="size-4"
              />
            ) : null}
          </div>
        </div>
      ) : null}

      {tab === "mine" && onCreateSticker ? (
        <div className="px-4 py-2">
          <button
            type="button"
            onClick={onCreateSticker}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-border py-3 font-bold text-foreground transition-opacity outline-none focus-visible:ring-2 focus-visible:ring-ring active:opacity-70"
          >
            <PlusIcon className="size-5" aria-hidden /> Create a sticker
          </button>
        </div>
      ) : null}

      <TrayGrid grid={grid} />

      {showAttribution ? <GiphyAttribution /> : null}
    </div>
  )
}

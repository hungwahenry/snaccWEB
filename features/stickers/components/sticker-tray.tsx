"use client"

import { SearchIcon, XIcon } from "lucide-react"
import { IconButton } from "@/components/ui/icon-button"
import { Input } from "@/components/ui/input"
import { LoadFailed } from "@/components/ui/load-failed"
import { PillTabs, type PillTab } from "@/components/ui/pill-tabs"
import { GiphyAttribution } from "@/features/giphy/components/giphy-attribution"
import type {
  PackPanelState,
  PackShelfState,
  TrayGridState,
  TrayTab,
} from "../types"
import { PackPanel } from "./pack-panel"
import { PackShelf } from "./pack-shelf"
import { StickerGridSkeleton } from "./sticker-grid-skeleton"
import { TrayGrid } from "./tray-grid"

export type StickerTrayProps = {
  tabs: PillTab<TrayTab>[]
  tab: TrayTab
  onTabChange: (tab: TrayTab) => void
  shelf: PackShelfState | null
  panel: PackPanelState | null
  search: {
    query: string
    onQueryChange: (query: string) => void
    placeholder: string
  } | null
  grid: TrayGridState | null
  showAttribution: boolean
}

export function StickerTray({
  tabs,
  tab,
  onTabChange,
  shelf,
  panel,
  search,
  grid,
  showAttribution,
}: StickerTrayProps) {
  return (
    <div className="flex flex-col">
      {tabs.length > 1 ? (
        <PillTabs tabs={tabs} value={tab} onChange={onTabChange} />
      ) : null}

      {shelf ? <PackShelf {...shelf} /> : null}

      {shelf?.failed ? (
        <LoadFailed
          title="Could not load your stickers"
          onRetry={shelf.onRetry}
        />
      ) : shelf?.loading ? (
        <StickerGridSkeleton />
      ) : panel ? (
        <PackPanel {...panel} />
      ) : null}

      {search ? (
        <div className="px-4 py-2">
          <div className="relative">
            <SearchIcon
              aria-hidden
              className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              type="search"
              value={search.query}
              onChange={(event) => search.onQueryChange(event.target.value)}
              placeholder={search.placeholder}
              aria-label={search.placeholder}
              autoCapitalize="none"
              autoCorrect="off"
              enterKeyHint="search"
              className="h-14 rounded-full pr-12 pl-11 text-base md:text-base [&::-webkit-search-cancel-button]:hidden"
            />
            {search.query ? (
              <IconButton
                icon={XIcon}
                label="Clear search"
                onClick={() => search.onQueryChange("")}
                className="absolute top-1/2 right-2.5 -translate-y-1/2 text-muted-foreground"
                iconClassName="size-4"
              />
            ) : null}
          </div>
        </div>
      ) : null}

      {grid ? <TrayGrid grid={grid} /> : null}

      {showAttribution ? <GiphyAttribution /> : null}
    </div>
  )
}

"use client"

import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { Eyebrow } from "@/components/ui/eyebrow"
import { IconButton } from "@/components/ui/icon-button"
import { LazyImage } from "@/components/ui/lazy-image"
import { ListFooter } from "@/components/ui/list-footer"
import { LoadFailed } from "@/components/ui/load-failed"
import { LoadMore } from "@/components/ui/load-more"
import type { Gif } from "@/features/giphy/types"
import { useHoldAction } from "@/hooks/use-hold-action"
import { cn } from "@/lib/utils"
import type {
  PickerRow,
  StickerPack,
  StickerTile as Tile,
  TileActionId,
} from "../types"
import { coverUrlOf } from "../utils/packs"
import { isFullWidth } from "../utils/picker"
import { FAVOURITE } from "../utils/tiles"
import { PackCover } from "./pack-cover"
import { PackRow } from "./pack-row"
import { StickerGridSkeleton } from "./sticker-grid-skeleton"
import { StickerMenu } from "./sticker-menu"
import { StickerTile } from "./sticker-tile"

export interface PickerRowsProps {
  rows: PickerRow[]
  loading: boolean
  failed: boolean
  retry: () => void
  more: { loading: boolean; onReach: () => void } | null
  onMake?: () => void
  onPick: (tile: Tile) => void
  onAction: (tile: Tile, action: TileActionId) => void
  onPickGiphy: (gif: Gif) => void
  onKeepGiphy?: (gif: Gif) => void
  onOpenPack: (packId: string) => void
  onBack: () => void
  onToggleSave: (pack: StickerPack) => void
}

export function PickerRows({
  rows,
  loading,
  failed,
  retry,
  more,
  ...handlers
}: PickerRowsProps) {
  if (rows.length === 0) {
    if (loading) return <StickerGridSkeleton count={15} />
    if (failed)
      return (
        <LoadFailed title="Could not load these stickers" onRetry={retry} />
      )
    return (
      <EmptyState
        title="Nothing matched"
        description="Try another word."
        compact
      />
    )
  }

  return (
    <div className="grid grid-cols-4 gap-1.5 px-4 pb-4 sm:grid-cols-5">
      {rows.map((row) => (
        <div
          key={row.key}
          data-row={row.key}
          className={cn(isFullWidth(row) && "col-span-full")}
        >
          <PickerRowView row={row} handlers={handlers} />
        </div>
      ))}
      {more ? (
        <div className="col-span-full">
          <LoadMore onReach={more.onReach} disabled={more.loading} />
          <ListFooter loading={more.loading} />
        </div>
      ) : null}
    </div>
  )
}

type RowHandlers = Omit<
  PickerRowsProps,
  "rows" | "loading" | "failed" | "retry" | "more"
>

function PickerRowView({
  row,
  handlers,
}: {
  row: PickerRow
  handlers: RowHandlers
}) {
  switch (row.kind) {
    case "tile":
      return (
        <StickerTile
          tile={row.tile}
          onPick={handlers.onPick}
          onAction={handlers.onAction}
        />
      )
    case "giphy":
      return (
        <GiphyTile
          gif={row.gif}
          onPick={handlers.onPickGiphy}
          onKeep={handlers.onKeepGiphy}
        />
      )
    case "hint":
      return (
        <p className="pt-1 pb-3 text-xs text-muted-foreground">
          Make one, or open any sticker&apos;s menu and pick Add to Favourites.
        </p>
      )
    case "discover":
      return <Eyebrow className="pt-5 pb-1">Discover</Eyebrow>
    case "pack":
      return (
        <PackRow
          pack={row.pack}
          details={row.details}
          onOpen={() => handlers.onOpenPack(row.pack.id)}
          action={{
            label: "Add",
            outline: false,
            onPress: () => handlers.onToggleSave(row.pack),
          }}
          compact
        />
      )
    case "top":
      return (
        <div className="flex items-center gap-3 pt-1 pb-3">
          <IconButton
            icon={ChevronLeftIcon}
            label="Back to your stickers"
            onClick={handlers.onBack}
          />
          <PackCover
            url={coverUrlOf(row.pack)}
            className="size-11 rounded-xl"
          />
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate font-bold text-foreground">
              {row.pack.title}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {row.details}
            </span>
          </div>
          {row.save ? (
            <Button
              size="sm"
              variant={row.save === "remove" ? "outline" : "default"}
              onClick={() => handlers.onToggleSave(row.pack)}
            >
              {row.save === "remove" ? "Remove" : "Add"}
            </Button>
          ) : null}
        </div>
      )
    case "section":
      return (
        <div className="flex items-center gap-2 pt-3 pb-1">
          {row.opens ? (
            <button
              type="button"
              onClick={() => handlers.onOpenPack(row.packId)}
              className="flex min-w-0 flex-1 items-center gap-2 text-left hover:opacity-70"
            >
              <SectionTitle title={row.title} byline={row.byline} />
              <ChevronRightIcon
                className="size-4 shrink-0 text-muted-foreground"
                aria-hidden
              />
            </button>
          ) : (
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <SectionTitle title={row.title} byline={row.byline} />
            </div>
          )}
          {row.makes && handlers.onMake ? (
            <button
              type="button"
              onClick={handlers.onMake}
              className="flex shrink-0 items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-semibold text-foreground transition-colors hover:bg-muted/70"
            >
              <PlusIcon className="size-4" aria-hidden />
              Make
            </button>
          ) : null}
        </div>
      )
  }
}

function SectionTitle({
  title,
  byline,
}: {
  title: string
  byline: string | null
}) {
  return (
    <>
      <span className="truncate text-sm font-bold text-foreground">
        {title}
      </span>
      {byline ? (
        <span className="truncate text-xs text-muted-foreground">{byline}</span>
      ) : null}
    </>
  )
}

function GiphyTile({
  gif,
  onPick,
  onKeep,
}: {
  gif: Gif
  onPick: (gif: Gif) => void
  onKeep?: (gif: Gif) => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const hold = useHoldAction(onKeep ? () => setMenuOpen(true) : undefined)

  return (
    <div className="group relative aspect-square">
      <button
        type="button"
        {...hold}
        onClick={() => onPick(gif)}
        aria-label={gif.title || "Sticker"}
        className="flex size-full items-center justify-center rounded-md transition-opacity outline-none hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring"
      >
        <LazyImage
          src={gif.preview_url ?? gif.url}
          alt=""
          draggable={false}
          className="size-full object-contain"
        />
      </button>
      {onKeep ? (
        <StickerMenu
          items={[FAVOURITE]}
          label="Sticker options"
          open={menuOpen}
          onOpenChange={setMenuOpen}
          onSelect={() => onKeep(gif)}
          className={cn(
            "absolute top-1 right-1 flex size-7 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm transition-opacity outline-none hover:bg-background focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring",
            menuOpen
              ? "opacity-100"
              : "opacity-0 group-hover:opacity-100 [@media(pointer:coarse)]:pointer-events-none"
          )}
        />
      ) : null}
    </div>
  )
}

"use client"

import { ClockIcon, LockIcon } from "lucide-react"
import { LazyImage } from "@/components/ui/lazy-image"
import { useHoldAction } from "@/hooks/use-hold-action"
import { cn } from "@/lib/utils"
import type { PackTile, StickerTileState } from "../types"
import { TileActionButton } from "./tile-action-button"

const LABELS: Record<StickerTileState, string> = {
  ready: "Sticker",
  locked: "Premium sticker",
  held: "Sticker under review",
}

const FACE =
  "relative flex size-full items-center justify-center [@media(pointer:coarse)]:select-none"

export function StickerTile({
  tile,
  onPick,
  onAction,
}: {
  tile: PackTile
  onPick?: (tile: PackTile) => void
  onAction: (tile: PackTile) => void
}) {
  const hold = useHoldAction(tile.action ? () => onAction(tile) : undefined)
  const { sticker, state } = tile

  const face = (
    <>
      <LazyImage
        src={sticker.preview_url ?? sticker.url}
        alt=""
        draggable={false}
        className={cn(
          "size-full object-contain",
          state === "held" && "opacity-40"
        )}
      />
      {state === "locked" ? (
        <span className="absolute right-1 bottom-1 flex size-5 items-center justify-center rounded-full bg-premium">
          <LockIcon className="size-3 text-white" aria-hidden />
        </span>
      ) : null}
      {state === "held" ? (
        <span className="absolute inset-x-1 bottom-1 flex items-center justify-center gap-1 rounded-full bg-background/90 py-0.5 text-[10px] font-bold text-muted-foreground">
          <ClockIcon className="size-3" aria-hidden />
          Under review
        </span>
      ) : null}
    </>
  )

  return (
    <div className="group relative aspect-square">
      {onPick ? (
        <button
          type="button"
          {...hold}
          onClick={() => onPick(tile)}
          aria-label={LABELS[state]}
          className={cn(
            FACE,
            "rounded-md transition-opacity outline-none hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring"
          )}
        >
          {face}
        </button>
      ) : (
        <div {...hold} role="img" aria-label={LABELS[state]} className={FACE}>
          {face}
        </div>
      )}
      {tile.action ? (
        <TileActionButton action={tile.action} onPress={() => onAction(tile)} />
      ) : null}
    </div>
  )
}

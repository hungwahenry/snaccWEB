"use client"

import { ClockIcon } from "lucide-react"
import { useState } from "react"
import { LazyImage } from "@/components/ui/lazy-image"
import { PremiumBadge } from "@/features/premium/components/premium-badge"
import { useHoldAction } from "@/hooks/use-hold-action"
import { cn } from "@/lib/utils"
import type { StickerState, StickerTile as Tile, TileActionId } from "../types"
import { StickerMenu } from "./sticker-menu"

const LABELS: Record<StickerState, string> = {
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
  tile: Tile
  onPick?: (tile: Tile) => void
  onAction: (tile: Tile, action: TileActionId) => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const hold = useHoldAction(
    tile.actions.length > 0 ? () => setMenuOpen(true) : undefined
  )
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
        <PremiumBadge className="absolute right-1 bottom-1" />
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
      {tile.actions.length > 0 ? (
        <StickerMenu
          items={tile.actions}
          label="Sticker options"
          open={menuOpen}
          onOpenChange={setMenuOpen}
          onSelect={(action) => onAction(tile, action)}
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

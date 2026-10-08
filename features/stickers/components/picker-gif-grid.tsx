"use client"

import { memo } from "react"
import { EmptyState } from "@/components/ui/empty-state"
import { LazyImage } from "@/components/ui/lazy-image"
import { LoadFailed } from "@/components/ui/load-failed"
import type { Gif } from "@/features/giphy/types"
import { aspectRatio } from "@/lib/aspect"
import { columnsOf } from "../utils/columns"
import { TrayGridSkeleton } from "./tray-grid-skeleton"

const COLUMNS = 2

export function PickerGifGrid({
  items,
  loading,
  failed,
  onRetry,
  onPick,
}: {
  items: Gif[]
  loading: boolean
  failed: boolean
  onRetry: () => void
  onPick: (gif: Gif) => void
}) {
  if (items.length === 0) {
    if (loading) return <TrayGridSkeleton />
    if (failed) return <LoadFailed onRetry={onRetry} />
    return (
      <EmptyState
        title="Nothing matched"
        description="Try another word."
        className="py-16"
      />
    )
  }

  return (
    <div className="grid grid-cols-2 gap-1.5 px-4 pb-4">
      {columnsOf(items, COLUMNS).map((column, index) => (
        <div key={index} className="flex flex-col gap-1.5">
          {column.map((gif) => (
            <GifTile key={gif.id} gif={gif} onPick={onPick} />
          ))}
        </div>
      ))}
    </div>
  )
}

const GifTile = memo(function GifTile({
  gif,
  onPick,
}: {
  gif: Gif
  onPick: (gif: Gif) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onPick(gif)}
      aria-label={gif.title || "GIF"}
      className="w-full overflow-hidden rounded-2xl bg-muted transition-opacity outline-none hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring"
      style={{ aspectRatio: aspectRatio(gif) }}
    >
      <LazyImage
        src={gif.preview_url ?? gif.url}
        alt=""
        draggable={false}
        className="size-full object-contain"
      />
    </button>
  )
})

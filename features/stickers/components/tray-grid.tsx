"use client"

import { memo } from "react"
import { EmptyState } from "@/components/ui/empty-state"
import { LazyImage } from "@/components/ui/lazy-image"
import { LoadFailed } from "@/components/ui/load-failed"
import { useHoldAction } from "@/hooks/use-hold-action"
import { aspectRatio } from "@/lib/aspect"
import type { TrayGridState, TrayTile } from "../types"
import { columnsOf } from "../utils/tray"
import { TileActionButton } from "./tile-action-button"
import { TrayGridSkeleton } from "./tray-grid-skeleton"

const COLUMNS = 2

export function TrayGrid({ grid }: { grid: TrayGridState }) {
  if (grid.items.length === 0) {
    if (grid.loading) return <TrayGridSkeleton />
    if (grid.failed) return <LoadFailed onRetry={grid.onRetry} />
    return (
      <EmptyState
        icon={grid.empty.icon}
        title={grid.empty.title}
        description={grid.empty.description}
      />
    )
  }

  return (
    <div className="grid grid-cols-2 gap-1.5 px-4">
      {columnsOf(grid.items, COLUMNS).map((column, index) => (
        <div key={index} className="flex flex-col gap-1.5">
          {column.map((tile) => (
            <Tile
              key={tile.id}
              tile={tile}
              label={tile.title || grid.itemLabel}
              onPick={grid.onPick}
              onKeep={grid.onKeep}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

const Tile = memo(function Tile({
  tile,
  label,
  onPick,
  onKeep,
}: {
  tile: TrayTile
  label: string
  onPick: (id: string) => void
  onKeep?: (id: string) => void
}) {
  const hold = useHoldAction(onKeep ? () => onKeep(tile.id) : undefined)

  return (
    <div className="group relative">
      <button
        type="button"
        {...hold}
        onClick={() => onPick(tile.id)}
        aria-label={label}
        className="w-full overflow-hidden rounded-2xl bg-muted transition-opacity outline-none hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring [@media(pointer:coarse)]:select-none"
        style={{ aspectRatio: aspectRatio(tile) }}
      >
        <LazyImage
          src={tile.preview_url ?? tile.url}
          alt=""
          draggable={false}
          className="size-full object-contain"
        />
      </button>
      {onKeep ? (
        <TileActionButton action="keep" onPress={() => onKeep(tile.id)} />
      ) : null}
    </div>
  )
})

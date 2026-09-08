"use client"

import { EmptyState } from "@/components/ui/empty-state"
import { LoadMore } from "@/components/ui/load-more"
import { Spinner } from "@/components/ui/spinner"
import { useHoldAction } from "@/hooks/use-hold-action"
import { aspectRatio } from "@/lib/aspect"
import type { TrayGrid as Grid, TrayTile } from "../hooks/use-sticker-tray"

export function TrayGrid({ grid }: { grid: Grid }) {
  if (grid.items.length === 0) {
    return grid.loading ? (
      <div className="flex justify-center py-16">
        <Spinner className="text-muted-foreground" />
      </div>
    ) : (
      <EmptyState
        icon={grid.empty.icon}
        title={grid.empty.title}
        description={grid.empty.description}
        className="py-16"
      />
    )
  }

  const columns: TrayTile[][] = [[], []]
  grid.items.forEach((tile, index) => columns[index % 2].push(tile))

  return (
    <>
      <div className="grid grid-cols-2 gap-1.5 px-4">
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className="flex flex-col gap-1.5">
            {column.map((tile) => (
              <Tile
                key={tile.id}
                tile={tile}
                onPick={() => grid.onPick(tile)}
                onLongPress={
                  grid.onLongPress ? () => grid.onLongPress?.(tile) : undefined
                }
              />
            ))}
          </div>
        ))}
      </div>
      {grid.onEndReached ? (
        <LoadMore onReach={grid.onEndReached} disabled={grid.loading} />
      ) : null}
    </>
  )
}

/// Tap to send; hold or right-click for the keep and remove actions.
function Tile({
  tile,
  onPick,
  onLongPress,
}: {
  tile: TrayTile
  onPick: () => void
  onLongPress?: () => void
}) {
  const hold = useHoldAction(onLongPress)

  return (
    <button
      type="button"
      {...hold}
      onClick={onPick}
      className="w-full overflow-hidden rounded-2xl bg-muted transition-opacity hover:opacity-80 [@media(pointer:coarse)]:select-none"
      style={{ aspectRatio: aspectRatio(tile) }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={tile.preview_url ?? tile.url}
        alt=""
        draggable={false}
        className="size-full object-contain"
        loading="lazy"
      />
    </button>
  )
}

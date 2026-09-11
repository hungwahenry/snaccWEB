"use client"

import { memo } from "react"
import { EmptyState } from "@/components/ui/empty-state"
import { LoadFailed } from "@/components/ui/load-failed"
import { LoadMore } from "@/components/ui/load-more"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { useHoldAction } from "@/hooks/use-hold-action"
import { aspectRatio } from "@/lib/aspect"
import type { TrayGridState, TrayTile } from "../types"
import { columnsOf } from "../utils/tray"

const COLUMNS = 2
const PLACEHOLDER_HEIGHTS = [
  ["h-32", "h-24", "h-40"],
  ["h-24", "h-40", "h-28"],
]

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
    <>
      <div className="grid grid-cols-2 gap-1.5 px-4">
        {columnsOf(grid.items, COLUMNS).map((column, index) => (
          <div key={index} className="flex flex-col gap-1.5">
            {column.map((tile) => (
              <Tile
                key={tile.id}
                tile={tile}
                label={tile.title || grid.itemLabel}
                onPick={grid.onPick}
                onHold={grid.onHold}
              />
            ))}
          </div>
        ))}
      </div>
      {grid.onEndReached ? (
        <LoadMore onReach={grid.onEndReached} disabled={grid.loadingMore} />
      ) : null}
      {grid.loadingMore ? (
        <div className="flex justify-center py-4">
          <Spinner className="text-muted-foreground" />
        </div>
      ) : null}
    </>
  )
}

function TrayGridSkeleton() {
  return (
    <div aria-hidden className="grid grid-cols-2 gap-1.5 px-4">
      {PLACEHOLDER_HEIGHTS.map((column, index) => (
        <div key={index} className="flex flex-col gap-1.5">
          {column.map((height, row) => (
            <Skeleton key={row} className={height} />
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
  onHold,
}: {
  tile: TrayTile
  label: string
  onPick: (id: string) => void
  onHold?: (id: string) => void
}) {
  const hold = useHoldAction(onHold ? () => onHold(tile.id) : undefined)

  return (
    <button
      type="button"
      {...hold}
      onClick={() => onPick(tile.id)}
      aria-label={label}
      className="w-full overflow-hidden rounded-2xl bg-muted transition-opacity outline-none hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring [@media(pointer:coarse)]:select-none"
      style={{ aspectRatio: aspectRatio(tile) }}
    >
      <img
        src={tile.preview_url ?? tile.url}
        alt=""
        draggable={false}
        className="size-full object-contain"
        loading="lazy"
      />
    </button>
  )
})

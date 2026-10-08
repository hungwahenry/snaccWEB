import { PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { LoadFailed } from "@/components/ui/load-failed"
import type { PackPanelState } from "../types"
import { StickerGrid } from "./sticker-grid"
import { StickerGridSkeleton } from "./sticker-grid-skeleton"

export function PackPanel({
  title,
  byline,
  tiles,
  loading,
  failed,
  empty,
  onRetry,
  onCreate,
  onPick,
  onAction,
}: PackPanelState) {
  return (
    <div className="flex flex-col">
      <div className="flex min-h-12 items-center gap-3 px-4 pt-1 pb-2">
        <div className="min-w-0 flex-1">
          <p className="truncate font-extrabold text-foreground">{title}</p>
          {byline ? (
            <p className="truncate text-xs text-muted-foreground">{byline}</p>
          ) : null}
        </div>
        {onCreate ? (
          <Button variant="outline" size="sm" onClick={onCreate}>
            <PlusIcon />
            Create a sticker
          </Button>
        ) : null}
      </div>

      {tiles.length > 0 ? (
        <StickerGrid tiles={tiles} onPick={onPick} onAction={onAction} />
      ) : failed ? (
        <LoadFailed onRetry={onRetry} />
      ) : loading ? (
        <StickerGridSkeleton />
      ) : (
        <EmptyState
          icon={empty.icon}
          title={empty.title}
          description={empty.description}
        />
      )}
    </div>
  )
}

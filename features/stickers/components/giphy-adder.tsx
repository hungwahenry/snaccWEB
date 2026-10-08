import { SearchIcon, SearchXIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { Input } from "@/components/ui/input"
import { LazyImage } from "@/components/ui/lazy-image"
import { LoadFailed } from "@/components/ui/load-failed"
import { GiphyAttribution } from "@/features/giphy/components/giphy-attribution"
import type { GiphyAdderView } from "../hooks/use-giphy-adder"
import { StickerGridSkeleton } from "./sticker-grid-skeleton"

export function GiphyAdder({
  query,
  onQueryChange,
  items,
  loading,
  failed,
  onRetry,
  onAdd,
  onDone,
}: GiphyAdderView) {
  return (
    <div className="flex flex-col gap-3 pt-3 pb-8">
      <div className="flex flex-col gap-3 px-4">
        <div className="flex items-center gap-2">
          <div className="relative min-w-0 flex-1">
            <SearchIcon
              aria-hidden
              className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              type="search"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Search Giphy stickers"
              aria-label="Search Giphy stickers"
              autoFocus
              className="pl-9 [&::-webkit-search-cancel-button]:hidden"
            />
          </div>
          <Button size="sm" variant="secondary" onClick={onDone}>
            Done
          </Button>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-muted-foreground">
            Click a sticker to add it.
          </span>
          <GiphyAttribution className="pt-0" />
        </div>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-4 gap-1.5 px-4 sm:grid-cols-5">
          {items.map((gif) => (
            <button
              key={gif.id}
              type="button"
              onClick={() => onAdd(gif)}
              aria-label={`Add ${gif.title || "this sticker"}`}
              className="flex aspect-square items-center justify-center rounded-md transition-opacity outline-none hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring"
            >
              <LazyImage
                src={gif.preview_url ?? gif.url}
                alt=""
                draggable={false}
                className="size-full object-contain"
              />
            </button>
          ))}
        </div>
      ) : loading ? (
        <StickerGridSkeleton />
      ) : failed ? (
        <LoadFailed title="Could not load stickers" onRetry={onRetry} />
      ) : (
        <EmptyState
          icon={SearchXIcon}
          title="Nothing matched"
          description="Try another word."
          compact
        />
      )}
    </div>
  )
}

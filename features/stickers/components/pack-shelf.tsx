import { HeartIcon, PlusIcon } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import type { PackShelfState } from "../types"
import { PackCover } from "./pack-cover"

const TILE =
  "flex size-12 shrink-0 items-center justify-center rounded-2xl outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"

export function PackShelf({
  packs,
  selectedId,
  loading,
  onSelect,
  onBrowse,
}: PackShelfState) {
  return (
    <div
      role="group"
      aria-label="Your sticker packs"
      className="flex [scrollbar-width:none] gap-2 overflow-x-auto px-4 py-2 [&::-webkit-scrollbar]:hidden"
    >
      {loading
        ? Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="size-12 shrink-0" />
          ))
        : packs.map((pack) => {
            const selected = pack.id === selectedId
            return (
              <button
                key={pack.id}
                type="button"
                aria-pressed={selected}
                aria-label={pack.title}
                title={pack.title}
                onClick={() => onSelect(pack.id)}
                className={cn(
                  TILE,
                  selected
                    ? "bg-accent ring-2 ring-primary"
                    : "hover:bg-accent/60"
                )}
              >
                {pack.favourites ? (
                  <HeartIcon className="size-6 fill-current text-primary" />
                ) : (
                  <PackCover url={pack.coverUrl} className="size-10" />
                )}
              </button>
            )
          })}
      <button
        type="button"
        onClick={onBrowse}
        aria-label="Find more packs"
        title="Find more packs"
        className={cn(
          TILE,
          "border border-dashed border-border text-muted-foreground hover:bg-accent hover:text-foreground"
        )}
      >
        <PlusIcon className="size-5" />
      </button>
    </div>
  )
}

import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { THEME_TILE } from "./theme-row"
import { THUMBNAIL_ASPECT } from "./theme-thumbnail"

function TilesSkeleton({ count }: { count: number }) {
  return (
    <div className="-mx-6 flex gap-3 overflow-hidden px-6 py-1">
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="flex shrink-0 flex-col items-center gap-1.5"
          style={{ width: THEME_TILE }}
        >
          <Skeleton
            className="rounded-2xl"
            style={{ width: THEME_TILE, height: THEME_TILE * THUMBNAIL_ASPECT }}
          />
          <Skeleton className="my-0.5 h-3 w-12" />
        </div>
      ))}
    </div>
  )
}

function HeadingSkeleton({ width }: { width: string }) {
  return (
    <div className="px-1 pb-1">
      <Skeleton className={cn("my-0.5 h-3", width)} />
    </div>
  )
}

export function ChatThemeSkeleton() {
  return (
    <div aria-hidden className="flex flex-col gap-6 overflow-hidden px-6 py-6">
      <Skeleton className="h-80 rounded-3xl" />
      <div className="flex flex-col gap-1">
        <HeadingSkeleton width="w-16" />
        <TilesSkeleton count={6} />
      </div>
      <div className="flex flex-col gap-1">
        <HeadingSkeleton width="w-20" />
        <TilesSkeleton count={2} />
        <div className="flex items-center gap-3 py-3.5">
          <Skeleton className="size-5" />
          <Skeleton className="my-1 h-4 w-32" />
          <Skeleton className="ml-auto size-5" />
        </div>
      </div>
      <Skeleton className="h-10 rounded-4xl" />
    </div>
  )
}

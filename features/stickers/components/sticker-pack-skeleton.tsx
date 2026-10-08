import { Skeleton } from "@/components/ui/skeleton"
import { StickerGridSkeleton } from "./sticker-grid-skeleton"

export function StickerPackSkeleton() {
  return (
    <div aria-hidden className="flex flex-col">
      <div className="flex flex-col items-center gap-3 px-6 pt-6 pb-5">
        <Skeleton className="size-24 rounded-3xl" />
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-9 w-36 rounded-full" />
      </div>
      <StickerGridSkeleton />
    </div>
  )
}

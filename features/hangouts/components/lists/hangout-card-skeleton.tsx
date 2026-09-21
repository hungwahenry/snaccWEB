import { Skeleton } from "@/components/ui/skeleton"
import { HangoutBlockSkeleton } from "../block/hangout-block-skeleton"

export function HangoutCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 border-b border-border px-4 py-4 sm:px-6">
      <div className="flex items-center gap-2">
        <Skeleton className="size-6 rounded-full" />
        <Skeleton className="h-4 w-32" />
      </div>
      <HangoutBlockSkeleton />
    </div>
  )
}

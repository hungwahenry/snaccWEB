import { Skeleton } from "@/components/ui/skeleton"

export function ScheduledRowSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <Skeleton className="size-12 shrink-0 rounded-lg" />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <Skeleton className="my-[3px] h-4 w-3/4" />
        <Skeleton className="my-[3px] h-3.5 w-44" />
      </div>
      <Skeleton className="size-9 shrink-0 rounded-full" />
    </div>
  )
}

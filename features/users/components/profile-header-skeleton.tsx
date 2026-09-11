import { Skeleton } from "@/components/ui/skeleton"

const COUNTS = [0, 1, 2, 3]

export function ProfileHeaderSkeleton() {
  return (
    <div className="flex flex-col">
      <Skeleton className="h-32 rounded-none sm:h-40" />
      <div className="flex flex-col gap-3 px-4 pb-4 sm:px-6">
        <div className="flex items-start justify-between gap-3">
          <Skeleton className="-mt-10 size-20 shrink-0 rounded-full ring-4 ring-background" />
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-9 w-24 rounded-full" />
            <Skeleton className="size-9 rounded-full" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex justify-between">
          {COUNTS.map((i) => (
            <Skeleton key={i} className="h-9 w-14" />
          ))}
        </div>
      </div>
      <div className="flex gap-2 border-b border-border px-4 py-2">
        {COUNTS.map((i) => (
          <Skeleton key={i} className="h-9 w-20 rounded-full" />
        ))}
      </div>
    </div>
  )
}

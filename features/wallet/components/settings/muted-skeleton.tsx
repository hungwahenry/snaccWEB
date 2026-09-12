import { Skeleton } from "@/components/ui/skeleton"

const ROWS = [0, 1, 2]

export function MutedSkeleton() {
  return (
    <div className="flex flex-col gap-1 px-6 py-6">
      <div className="flex flex-col pb-2">
        <Skeleton className="my-[5px] h-3.5 w-full" />
        <Skeleton className="my-[5px] h-3.5 w-3/4" />
      </div>
      {ROWS.map((row) => (
        <div key={row} className="flex items-center gap-3 py-2.5">
          <Skeleton className="size-11 shrink-0 rounded-full" />
          <div className="flex min-w-0 flex-1 flex-col">
            <Skeleton className="my-1 h-4 w-28" />
            <Skeleton className="my-[3px] h-3.5 w-40 max-w-full" />
          </div>
          <Skeleton className="h-9 w-[84px] rounded-full" />
        </div>
      ))}
    </div>
  )
}

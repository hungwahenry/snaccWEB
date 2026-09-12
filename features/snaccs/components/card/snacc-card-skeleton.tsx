import { Skeleton } from "@/components/ui/skeleton"

const ACTIONS = [0, 1, 2]

export function SnaccCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 border-b border-border px-4 py-4">
      <div className="flex gap-3">
        <Skeleton className="size-11 shrink-0 rounded-full" />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex items-center gap-1.5">
            <Skeleton className="my-1 h-4 w-28" />
            <Skeleton className="my-[3px] h-3.5 w-16" />
          </div>
          <div className="flex flex-col">
            <Skeleton className="my-1 h-4 w-full" />
            <Skeleton className="my-1 h-4 w-3/5" />
          </div>
        </div>
      </div>
      <div className="flex h-9 items-center justify-between gap-2 pl-14">
        <Skeleton className="mx-1 size-[22px] rounded-full" />
        <div className="flex items-center gap-3">
          {ACTIONS.map((i) => (
            <Skeleton key={i} className="mx-1.5 size-[22px] rounded-full" />
          ))}
        </div>
      </div>
    </div>
  )
}

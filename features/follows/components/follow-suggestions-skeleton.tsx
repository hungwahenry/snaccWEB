import { Eyebrow } from "@/components/ui/eyebrow"
import { Skeleton } from "@/components/ui/skeleton"

const ROWS = [0, 1, 2, 3, 4]

export function FollowSuggestionsSkeleton() {
  return (
    <div className="flex flex-col gap-2.5">
      <Eyebrow className="px-1">People to follow</Eyebrow>
      <div className="flex flex-col gap-1">
        {ROWS.map((i) => (
          <div key={i} className="flex items-center gap-3 px-1 py-2">
            <Skeleton className="size-10 shrink-0 rounded-full" />
            <div className="flex min-w-0 flex-1 flex-col">
              <Skeleton className="my-[3px] h-3.5 w-28" />
              <Skeleton className="my-0.5 h-3 w-20" />
            </div>
            <Skeleton className="h-8 w-18 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  )
}

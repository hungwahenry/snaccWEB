import { Skeleton } from "@/components/ui/skeleton"

export function MatchdaySkeleton() {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="px-6">
        <Skeleton className="h-3 w-20" />
      </div>
      <div className="flex gap-2.5 overflow-hidden px-6">
        {[0, 1, 2].map((i) => (
          <Skeleton
            key={i}
            className="h-[122px] w-[220px] shrink-0 rounded-2xl"
          />
        ))}
      </div>
    </div>
  )
}

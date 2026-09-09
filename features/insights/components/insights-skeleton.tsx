import { Skeleton } from "@/components/ui/skeleton"

export function InsightsSkeleton() {
  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-wrap gap-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton
            key={index}
            className="h-[108px] grow basis-[46%] rounded-2xl"
          />
        ))}
      </div>

      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-4 w-44" />
          </div>
          <Skeleton className="h-[164px] w-full rounded-2xl" />
        </div>
      ))}
    </div>
  )
}

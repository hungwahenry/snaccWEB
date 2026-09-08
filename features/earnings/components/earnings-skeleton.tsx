import { Skeleton } from "@/components/ui/skeleton"

export function EarningsSkeleton() {
  return (
    <div className="flex flex-col gap-7 px-6 py-6">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-14 w-48" />
        <Skeleton className="h-3 w-56" />
      </div>
      <Skeleton className="h-12 w-full rounded-2xl" />
      <div className="flex flex-col gap-4">
        <Skeleton className="h-5 w-28" />
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-10" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
          </div>
        ))}
      </div>
    </div>
  )
}

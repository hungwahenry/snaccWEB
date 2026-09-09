import { Skeleton } from "@/components/ui/skeleton"

export function PremiumSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-4">
      <Skeleton className="h-24 w-full rounded-xl" />

      <div className="flex flex-col gap-3">
        <Skeleton className="h-[74px] w-full rounded-xl" />
        <Skeleton className="h-[74px] w-full rounded-xl" />
        <Skeleton className="h-8 w-full" />
      </div>

      <div className="flex flex-col gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="flex gap-3">
            <Skeleton className="mt-0.5 size-5 shrink-0 rounded" />
            <div className="flex w-full flex-col gap-1.5">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-full max-w-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

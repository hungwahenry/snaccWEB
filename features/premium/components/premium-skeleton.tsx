import { Skeleton } from "@/components/ui/skeleton"

const PLANS = [0, 1]
const BENEFITS = [0, 1, 2, 3, 4, 5]

export function PremiumSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="rounded-xl border p-4">
        <Skeleton className="size-5 rounded-md" />
        <Skeleton className="mt-[11px] mb-[3px] h-3.5 w-4/5" />
      </div>

      <div className="flex flex-col gap-3">
        {PLANS.map((plan) => (
          <div
            key={plan}
            className="flex items-center justify-between gap-4 rounded-xl border p-4"
          >
            <div className="flex flex-col">
              <Skeleton className="my-[3px] h-3.5 w-20" />
              <Skeleton className="my-[3px] h-3.5 w-16" />
            </div>
            <Skeleton className="h-9 w-14 rounded-full" />
          </div>
        ))}
        <div className="flex flex-col">
          <Skeleton className="my-0.5 h-3 w-full" />
          <Skeleton className="my-0.5 h-3 w-1/2" />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {BENEFITS.map((benefit) => (
          <div key={benefit} className="flex gap-3">
            <Skeleton className="mt-0.5 size-5 shrink-0 rounded-md" />
            <div className="flex flex-1 flex-col">
              <Skeleton className="my-[3px] h-3.5 w-36" />
              <Skeleton className="my-[3px] h-3.5 w-full max-w-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

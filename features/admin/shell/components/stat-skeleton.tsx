import { Skeleton } from "@/components/ui/skeleton"

export function StatSkeleton() {
  return (
    <div className="rounded-lg border px-4 py-3">
      <Skeleton className="my-0.5 h-3 w-20" />
      <Skeleton className="mt-1.5 mb-1 h-5 w-24" />
      <Skeleton className="my-0.5 h-3 w-28" />
    </div>
  )
}

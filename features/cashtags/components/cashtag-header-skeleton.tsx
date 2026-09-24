import { Skeleton } from "@/components/ui/skeleton"

export function CashtagHeaderSkeleton() {
  return (
    <div className="flex flex-col gap-4 border-b border-border px-4 pt-3 pb-4">
      <div className="flex items-center gap-3">
        <Skeleton className="size-11 rounded-full" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-24 w-full" />
    </div>
  )
}

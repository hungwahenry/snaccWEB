import { Skeleton } from "@/components/ui/skeleton"

export function EggsSkeleton() {
  return (
    <div className="flex flex-col">
      <Skeleton className="mx-6 my-3 h-4 w-56" />
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-3 border-b border-border px-6 py-3"
        >
          <Skeleton className="size-12 shrink-0 rounded-full" />
          <div className="flex flex-1 flex-col gap-1.5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-full max-w-sm" />
            <Skeleton className="h-3 w-40" />
          </div>
          <Skeleton className="h-6 w-20 shrink-0 rounded-full" />
        </div>
      ))}
    </div>
  )
}

import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <>
      <div className="h-14 border-b border-border" />
      <div className="flex flex-col gap-8 px-6 py-6">
        <div className="flex flex-col items-center gap-3">
          <Skeleton className="h-14 w-40" />
          <Skeleton className="h-7 w-32" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-full rounded-full" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="flex flex-col gap-3">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="size-8 rounded-full" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="ml-auto h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

import { Skeleton } from "@/components/ui/skeleton"

const ROWS = 3

export function ConversationDetailsSkeleton() {
  return (
    <div aria-hidden className="flex flex-col gap-6 px-6 py-6">
      <div className="flex flex-col items-center gap-3">
        <Skeleton className="size-24 rounded-full" />
        <Skeleton className="h-6 w-40 rounded-full" />
        <Skeleton className="h-4 w-24 rounded-full" />
        <Skeleton className="h-9 w-28 rounded-full" />
      </div>
      <div className="flex flex-col gap-1">
        <Skeleton className="mb-1 h-3 w-16 rounded-full" />
        {Array.from({ length: ROWS }, (_, index) => (
          <div key={index} className="flex items-center gap-3 py-3.5">
            <Skeleton className="size-5 rounded-full" />
            <Skeleton className="h-4 flex-1 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  )
}

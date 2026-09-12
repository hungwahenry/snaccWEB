import { Skeleton } from "@/components/ui/skeleton"

export function ConversationRowSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
      <Skeleton className="size-12 shrink-0 rounded-full" />
      <div className="flex flex-1 flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-4 w-32 rounded-full" />
          <Skeleton className="h-3 w-8 rounded-full" />
        </div>
        <Skeleton className="h-3.5 w-52 rounded-full" />
      </div>
    </div>
  )
}

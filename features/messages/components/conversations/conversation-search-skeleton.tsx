import { Skeleton } from "@/components/ui/skeleton"

export function ConversationSearchSkeleton() {
  return (
    <div
      aria-hidden
      className="flex h-14 items-center gap-3 border-b border-border px-4"
    >
      <Skeleton className="h-10 flex-1 rounded-full" />
      <Skeleton className="h-4 w-12 rounded-full" />
    </div>
  )
}

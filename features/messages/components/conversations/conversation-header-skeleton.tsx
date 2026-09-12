import { Skeleton } from "@/components/ui/skeleton"

export function ConversationHeaderSkeleton() {
  return (
    <div className="flex h-14 items-center gap-3 border-b border-border px-3">
      <Skeleton className="size-9 rounded-full" />
      <Skeleton className="h-5 w-32 rounded-full" />
    </div>
  )
}

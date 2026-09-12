import { Skeleton } from "@/components/ui/skeleton"
import { SkeletonRows } from "@/components/ui/skeleton-rows"
import { ConversationRowSkeleton } from "@/features/messages/components/conversations/conversation-row-skeleton"

export default function Loading() {
  return (
    <>
      <div className="flex h-14 items-center border-b border-border px-4">
        <Skeleton className="h-5 w-24 rounded-full" />
      </div>
      <div className="px-4 pt-2 pb-2">
        <Skeleton className="h-10 w-full rounded-full" />
      </div>
      <SkeletonRows count={8} item={ConversationRowSkeleton} />
    </>
  )
}

import { NotificationRowSkeleton } from "@/features/notifications/components/notification-row"
import { SkeletonRows } from "@/components/ui/skeleton-rows"

export default function Loading() {
  return (
    <>
      <div className="h-14 border-b border-border" />
      <SkeletonRows count={8} item={NotificationRowSkeleton} />
    </>
  )
}

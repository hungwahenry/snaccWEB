import { SkeletonRows } from "@/components/ui/skeleton-rows"
import { TabHeader } from "@/features/navigation/components/tab-header"
import { NotificationRowSkeleton } from "@/features/notifications/components/notification-row-skeleton"

export default function Loading() {
  return (
    <>
      <TabHeader title="Notifications" />
      <SkeletonRows count={8} item={NotificationRowSkeleton} />
    </>
  )
}

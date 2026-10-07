import { StatusBadge } from "@/features/admin/shell/components/status-badge"
import type { AdminAnnouncement } from "../types"
import { announcementBadges } from "../utils/announcement"

export function AnnouncementBadges({
  announcement,
}: {
  announcement: AdminAnnouncement
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {announcementBadges(announcement).map((badge) => (
        <StatusBadge key={badge.label} status={badge} />
      ))}
    </div>
  )
}

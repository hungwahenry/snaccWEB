import { StatusBadge } from "@/features/admin/shell/components/status-badge"
import type { StatusMeta } from "@/features/admin/shell/types"

export function PackBadges({ badges }: { badges: StatusMeta[] }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {badges.map((badge) => (
        <StatusBadge key={badge.label} status={badge} />
      ))}
    </div>
  )
}

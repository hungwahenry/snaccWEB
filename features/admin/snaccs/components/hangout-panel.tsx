import { Badge } from "@/components/ui/badge"
import { Fact, Facts } from "@/features/admin/shell/components/detail"
import { StatusBadge } from "@/features/admin/shell/components/status-badge"
import { formatDate } from "@/lib/format"
import type { AdminHangout } from "../types"
import { hangoutGoing, hangoutStatus } from "../utils/snaccs"

export function HangoutPanel({ hangout }: { hangout: AdminHangout }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="flex min-w-0 items-center gap-2 text-sm font-semibold">
          <span aria-hidden className="text-lg">
            {hangout.emoji}
          </span>
          <span className="truncate">{hangout.title}</span>
        </p>
        <div className="flex flex-wrap gap-2">
          <StatusBadge status={hangoutStatus(hangout)} />
          {hangout.private ? <Badge variant="outline">Private</Badge> : null}
        </div>
      </div>
      <Facts>
        <Fact label="Starts" value={formatDate(hangout.starts_at)} />
        <Fact label="Place" value={hangout.place ?? "Hidden"} />
        <Fact label="Going" value={hangoutGoing(hangout)} />
      </Facts>
    </div>
  )
}

import { Badge } from "@/components/ui/badge"
import { ContentMedia } from "@/features/admin/shell/components/content-media"
import { StatusBadge } from "@/features/admin/shell/components/status-badge"
import { UserCell } from "@/features/admin/shell/components/user-cell"
import { formatDate, formatNumber } from "@/lib/format"
import type { AdminSnacc, SnaccContent } from "../types"
import { isBlank, snaccBadges } from "../utils/snaccs"

function SnaccBody({ snacc }: { snacc: SnaccContent }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <UserCell user={snacc.author} note={formatDate(snacc.created_at)} />
        <div className="flex flex-wrap gap-2">
          {snacc.anonymous ? <Badge variant="outline">Anonymous</Badge> : null}
          {snacc.spoiler ? <Badge variant="outline">Spoiler</Badge> : null}
          {snacc.edited_at ? <Badge variant="outline">Edited</Badge> : null}
        </div>
      </div>

      {snacc.body ? (
        <p className="text-sm whitespace-pre-wrap">{snacc.body}</p>
      ) : null}
      <ContentMedia
        images={snacc.images}
        gif={snacc.gif}
        sticker={snacc.sticker}
        voice={snacc.voice}
      />
      {isBlank(snacc) ? (
        <p className="text-sm text-muted-foreground">Nothing left to show.</p>
      ) : null}
    </div>
  )
}

export function SnaccView({ snacc }: { snacc: AdminSnacc }) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border p-4">
      <div className="flex flex-wrap items-center justify-end gap-2 empty:hidden">
        {snaccBadges(snacc).map((badge) => (
          <StatusBadge key={badge.label} status={badge} />
        ))}
      </div>

      <SnaccBody snacc={snacc} />

      {snacc.resnacc_of ? (
        <div className="rounded-lg border bg-muted/30 p-3">
          <p className="mb-2 text-xs text-muted-foreground">Quoting</p>
          <SnaccBody snacc={snacc.resnacc_of} />
        </div>
      ) : null}

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span>{formatNumber(snacc.reactions_count)} reactions</span>
        <span>{formatNumber(snacc.comments_count)} replies</span>
        <span>{formatNumber(snacc.resnaccs_count)} resnaccs</span>
        <span>{formatNumber(snacc.views_count)} views</span>
        <span>{formatNumber(snacc.reports_count)} reports</span>
      </div>
    </div>
  )
}

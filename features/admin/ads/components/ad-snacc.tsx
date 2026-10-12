import { SnaccBody } from "@/features/admin/snaccs/components/snacc-view"
import { formatNumber } from "@/lib/format"
import type { AdminAd } from "../types"

export function AdSnacc({ snacc }: { snacc: AdminAd["snacc"] }) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border p-4">
      <SnaccBody snacc={snacc} />

      {snacc.resnacc_of ? (
        <div className="rounded-lg border bg-muted/30 p-3">
          <p className="mb-2 text-xs text-muted-foreground">Quoting</p>
          <SnaccBody snacc={snacc.resnacc_of} />
        </div>
      ) : null}

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span>{formatNumber(snacc.likes_count)} likes</span>
        <span>{formatNumber(snacc.comments_count)} replies</span>
        <span>{formatNumber(snacc.resnaccs_count)} resnaccs</span>
        <span>{formatNumber(snacc.views_count)} views</span>
      </div>
    </div>
  )
}

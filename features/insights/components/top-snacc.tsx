import { ChevronRightIcon } from "lucide-react"
import Link from "next/link"
import { snaccPath } from "@/features/snaccs/routes"
import { compactCount, formatDuration, percent } from "@/lib/format"
import type { SnaccInsight } from "../types"

export function TopSnacc({
  snacc,
  place,
}: {
  snacc: SnaccInsight
  place: number
}) {
  return (
    <Link
      href={snaccPath(snacc.snaccId)}
      className="flex items-center gap-3 rounded-2xl bg-card p-4 transition-opacity hover:opacity-80"
    >
      <span className="w-5 text-base font-extrabold text-muted-foreground tabular-nums">
        {place}
      </span>

      <div className="flex flex-1 flex-col gap-1.5">
        <p className="line-clamp-2 text-[15px] leading-5">
          {snacc.excerpt ?? "A snacc with no words"}
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <Figure label="views" value={compactCount(snacc.views)} />
          <Figure label="engaged" value={percent(snacc.engagementRate)} />
          <Figure label="read" value={formatDuration(snacc.dwellSeconds)} />
          <Figure label="reactions" value={compactCount(snacc.reactions)} />
          <Figure label="comments" value={compactCount(snacc.comments)} />
          <Figure label="resnaccs" value={compactCount(snacc.resnaccs)} />
          <Figure label="saves" value={compactCount(snacc.bookmarks)} />
          <Figure label="taps" value={compactCount(snacc.authorTaps)} />
        </div>
      </div>

      <ChevronRightIcon className="size-5 shrink-0 text-muted-foreground" />
    </Link>
  )
}

function Figure({ label, value }: { label: string; value: string }) {
  return (
    <span className="text-[11px] text-muted-foreground">
      <span className="text-[11px] font-bold text-foreground tabular-nums">
        {value}
      </span>{" "}
      {label}
    </span>
  )
}

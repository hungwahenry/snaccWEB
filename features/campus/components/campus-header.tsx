import type { UniversityDetail } from "../types"
import { campusStats } from "../utils/labels"
import { CampusBadge } from "./campus-badge"

export function CampusHeader({ campus }: { campus: UniversityDetail }) {
  return (
    <div className="flex items-center gap-4 border-b border-border px-4 py-4">
      <CampusBadge campus={campus} className="size-14 text-lg" />
      <div className="min-w-0 flex-1">
        <h2 className="truncate text-xl font-extrabold tracking-tight text-foreground">
          {campus.name}
        </h2>
        {campus.motto ? (
          <p className="truncate text-sm text-muted-foreground">
            {campus.motto}
          </p>
        ) : null}
        <p className="mt-1 text-sm font-semibold text-muted-foreground">
          {campusStats(campus)}
        </p>
      </div>
    </div>
  )
}

import { Skeleton } from "@/components/ui/skeleton"
import { compactCount } from "@/lib/format"
import type { UniversityDetail } from "@/features/campus/types"

export function CampusHeader({ campus }: { campus: UniversityDetail }) {
  return (
    <div className="flex items-center gap-4 border-b border-border px-4 py-4">
      {campus.logo_url ? (
        <img
          src={campus.logo_url}
          alt=""
          className="size-14 shrink-0 rounded-full object-cover"
        />
      ) : (
        <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-muted text-lg font-extrabold text-muted-foreground">
          {campus.acronym.slice(0, 2).toUpperCase()}
        </span>
      )}
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
          {compactCount(campus.members_count)} students ·{" "}
          {compactCount(campus.snaccs_count)} snaccs
        </p>
      </div>
    </div>
  )
}

export function CampusHeaderSkeleton() {
  return (
    <div className="flex items-center gap-4 border-b border-border px-4 py-4">
      <Skeleton className="size-14 rounded-full" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-3.5 w-32" />
      </div>
    </div>
  )
}

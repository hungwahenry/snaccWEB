import { compactCount } from "@/lib/format"
import type { PublicCampus } from "./public"

export function CampusHeader({ campus }: { campus: PublicCampus }) {
  return (
    <div className="flex flex-col gap-3 px-6 pt-6 pb-4">
      <div className="flex items-center gap-3">
        <div className="bg-foreground text-background flex size-16 shrink-0 items-center justify-center rounded-2xl text-xl font-extrabold">
          {campus.acronym}
        </div>
        <div className="min-w-0">
          <h1 className="text-foreground text-xl font-extrabold tracking-tight">{campus.name}</h1>
          {campus.motto ? <p className="text-muted-foreground text-sm">{campus.motto}</p> : null}
        </div>
      </div>

      <div className="flex gap-10">
        <Stat count={campus.members_count} label="Students" />
        <Stat count={campus.snaccs_count} label="Snaccs" />
      </div>
    </div>
  )
}

function Stat({ count, label }: { count: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-foreground text-base font-extrabold">{compactCount(count)}</span>
      <span className="text-muted-foreground text-xs">{label}</span>
    </div>
  )
}

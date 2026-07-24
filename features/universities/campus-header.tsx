import { compactCount } from "@/lib/format"
import type { PublicCampus } from "./public"

export function CampusHeader({ campus }: { campus: PublicCampus }) {
  return (
    <div className="flex flex-col gap-3 px-6 pt-6 pb-4">
      <div className="flex flex-col gap-0.5">
        <h1 className="text-foreground text-2xl font-extrabold tracking-tight">{campus.name}</h1>
        <p className="text-muted-foreground text-base">{campus.acronym}</p>
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

import { Mark } from "@/components/marketing/mark"
import { compactCount } from "@/lib/format"
import type { UniversityDetail } from "../../types"

export const UNIVERSITY_CARD_WIDTH = 340

export function UniversityShareCard({
  university,
}: {
  university: UniversityDetail
}) {
  return (
    <div
      style={{ width: UNIVERSITY_CARD_WIDTH }}
      className="flex flex-col gap-5 border border-border bg-background p-6"
    >
      <div className="flex flex-col items-center gap-0.5">
        <span className="line-clamp-2 text-center text-xl font-extrabold text-foreground">
          {university.name}
        </span>
        <span className="text-center text-sm text-muted-foreground">
          {university.acronym}
        </span>
      </div>

      <div className="flex justify-center gap-12">
        <Stat count={university.members_count} label="Students" />
        <Stat count={university.snaccs_count} label="Snaccs" />
      </div>

      <div className="flex items-center justify-between border-t border-border pt-3">
        <span className="text-xs text-muted-foreground">Join us on Snacc</span>
        <Mark />
      </div>
    </div>
  )
}

function Stat({ count, label }: { count: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-base font-extrabold text-foreground">
        {compactCount(count)}
      </span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}

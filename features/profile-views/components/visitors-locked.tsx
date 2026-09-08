import { VenetianMaskIcon } from "lucide-react"
import { compactCount } from "@/lib/format"

export function VisitorsLocked({ total }: { total: number }) {
  const been = total === 1 ? "person has" : "people have"

  return (
    <div className="flex animate-in flex-col items-center justify-center gap-5 px-8 py-24 duration-300 fade-in">
      <div className="flex size-16 items-center justify-center rounded-full bg-muted">
        <VenetianMaskIcon className="size-7 text-muted-foreground" />
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-center text-xl font-extrabold text-foreground">
          {total > 0
            ? `${compactCount(total)} ${been} been by`
            : "You’re browsing invisibly"}
        </p>
        <p className="max-w-xs text-center text-sm leading-5 text-muted-foreground">
          {total > 0
            ? "Turn visitors on to put names to them. They’ll see you when you visit theirs."
            : "Nobody sees your name when you open their profile, and you don’t see who opens yours."}
        </p>
      </div>
    </div>
  )
}

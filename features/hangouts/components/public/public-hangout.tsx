import { UsersIcon } from "lucide-react"
import { WAT_TIME_ZONE } from "@/lib/format"
import type { SnaccHangout } from "../../types"
import { goingLine, whenLineFor } from "../../utils/hangouts"

export function PublicHangout({ hangout }: { hangout: SnaccHangout }) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-border p-3.5">
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-2xl"
        >
          {hangout.emoji}
        </span>
        <span className="flex min-w-0 flex-col gap-0.5">
          <span className="line-clamp-2 text-base font-extrabold text-foreground">
            {hangout.title}
          </span>
          <span className="text-sm text-muted-foreground">
            {whenLineFor(hangout.state, hangout.starts_at, WAT_TIME_ZONE)}
          </span>
        </span>
      </div>
      <span className="flex items-center gap-2 text-sm text-foreground">
        <UsersIcon className="size-4 text-muted-foreground" />
        {goingLine(hangout)} · join in the app
      </span>
    </div>
  )
}

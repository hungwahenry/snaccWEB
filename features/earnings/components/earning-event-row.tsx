import { SparklesIcon } from "lucide-react"
import { UserAvatar } from "@/components/ui/user-avatar"
import { nameOf } from "@/features/users/utils/names"
import { formatNaira, shortDate } from "@/lib/format"
import type { EarningEvent } from "../types"
import { earningLine } from "../utils/earning-events"

export function EarningEventRow({ event }: { event: EarningEvent }) {
  const line = earningLine(event)

  return (
    <div className="flex items-center gap-3 px-6 py-2.5">
      {event.actor ? (
        <UserAvatar
          alt={nameOf(event.actor)}
          className="size-9"
          avatarUrl={event.actor.avatar_url}
          name={event.actor.username}
        />
      ) : (
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted">
          <SparklesIcon className="size-4 text-muted-foreground" />
        </span>
      )}
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm text-foreground">
          {line.who ? <span className="font-bold">{line.who} </span> : null}
          {line.what}
        </span>
        <span className="text-xs text-muted-foreground">
          {shortDate(event.created_at)}
        </span>
      </span>
      <span className="text-sm font-extrabold text-foreground tabular-nums">
        +{formatNaira(event.amount)}
      </span>
    </div>
  )
}

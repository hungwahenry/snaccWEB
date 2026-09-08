import { Spinner } from "@/components/ui/spinner"
import { UserAvatar } from "@/components/ui/user-avatar"
import { formatNaira, shortDate } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { MoneyRequest } from "../../types"
import { requestState, type RequestBox } from "../../utils/requests"
import { StatusPill } from "../shared/status-pill"

export function RequestRow({
  request,
  box,
  busy,
  onPress,
}: {
  request: MoneyRequest
  box: RequestBox
  busy: boolean
  onPress: (request: MoneyRequest) => void
}) {
  const other = box === "incoming" ? request.requester : request.target
  const state = requestState(request, box)

  return (
    <button
      type="button"
      onClick={() => onPress(request)}
      className="flex w-full items-center gap-3 py-4 text-left transition-transform active:scale-[0.99]"
    >
      <UserAvatar
        alt={other.display_name ?? "User"}
        className="size-11"
        avatarUrl={other.avatar_url}
        name={other.username}
      />
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate font-bold text-foreground">
          @{other.username}
        </span>
        <span className="truncate text-sm text-muted-foreground">
          {request.note
            ? `“${request.note}”`
            : box === "incoming"
              ? "Asked you"
              : "You asked"}
          {" · "}
          {shortDate(request.created_at)}
        </span>
      </span>
      <span className="flex flex-col items-end gap-1">
        <span
          className={cn(
            "text-base font-extrabold tabular-nums",
            state.tone === "good" ? "text-success" : "text-foreground"
          )}
        >
          {formatNaira(request.amount)}
        </span>
        {busy ? (
          <Spinner className="text-muted-foreground" />
        ) : (
          <StatusPill label={state.label} tone={state.tone} />
        )}
      </span>
    </button>
  )
}

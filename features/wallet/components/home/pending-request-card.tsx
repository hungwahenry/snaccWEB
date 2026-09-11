import { UserAvatar } from "@/components/ui/user-avatar"
import { nameOf } from "@/features/users/utils/names"
import { formatNaira } from "@/lib/format"
import type { MoneyRequest } from "../../types"
import {
  requestCounterparty,
  requestHandle,
  requestLine,
  requestState,
} from "../../utils/requests"
import { RequestActions } from "../requests/request-actions"
import { StatusPill } from "../shared/status-pill"

export function PendingRequestCard({
  request,
  busy,
  onOpen,
  onPay,
  onDecline,
}: {
  request: MoneyRequest
  busy: boolean
  onOpen: (request: MoneyRequest) => void
  onPay: (request: MoneyRequest) => void
  onDecline: (request: MoneyRequest) => void
}) {
  const person = requestCounterparty(request, "incoming")
  const state = requestState(request, "incoming")

  return (
    <div className="flex flex-col gap-3 rounded-3xl bg-card p-4">
      <button
        type="button"
        onClick={() => onOpen(request)}
        className="flex w-full items-center gap-3 text-left transition-transform active:scale-[0.99]"
      >
        <UserAvatar
          alt={nameOf(person)}
          className="size-11"
          avatarUrl={person.avatar_url}
          name={person.username}
        />
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="truncate font-bold text-foreground">
            {requestHandle(request, "incoming")}
          </span>
          <span className="truncate text-sm text-muted-foreground">
            {requestLine(request, "incoming")}
          </span>
        </span>
        <span className="text-base font-extrabold text-foreground tabular-nums">
          {formatNaira(request.amount)}
        </span>
      </button>

      {state.open ? (
        <RequestActions
          box="incoming"
          busy={busy}
          onPay={() => onPay(request)}
          onDecline={() => onDecline(request)}
        />
      ) : (
        <div className="flex justify-end">
          <StatusPill label={state.label} tone={state.tone} />
        </div>
      )}
    </div>
  )
}

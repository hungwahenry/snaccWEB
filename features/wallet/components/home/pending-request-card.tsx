import { UserAvatar } from "@/components/ui/user-avatar"
import { formatNaira } from "@/lib/format"
import type { MoneyRequest } from "../../types"
import { RequestActions } from "../requests/request-actions"

export function PendingRequestCard({
  request,
  paying,
  onPress,
  onPay,
  onDecline,
}: {
  request: MoneyRequest
  paying: boolean
  onPress: (request: MoneyRequest) => void
  onPay: (request: MoneyRequest) => void
  onDecline: (request: MoneyRequest) => void
}) {
  return (
    <div className="flex flex-col gap-3 rounded-3xl bg-card p-4">
      <button
        type="button"
        onClick={() => onPress(request)}
        className="flex w-full items-center gap-3 text-left transition-transform active:scale-[0.99]"
      >
        <UserAvatar
          alt={request.requester.display_name ?? "User"}
          className="size-11"
          avatarUrl={request.requester.avatar_url}
          name={request.requester.username}
        />
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="truncate font-bold text-foreground">
            @{request.requester.username}
          </span>
          <span className="truncate text-sm text-muted-foreground">
            {request.note ? `“${request.note}”` : "Asked you for money"}
          </span>
        </span>
        <span className="text-base font-extrabold text-foreground tabular-nums">
          {formatNaira(request.amount)}
        </span>
      </button>

      <RequestActions
        box="incoming"
        busy={paying}
        onPay={() => onPay(request)}
        onDecline={() => onDecline(request)}
      />
    </div>
  )
}

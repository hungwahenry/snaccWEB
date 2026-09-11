import { HandCoinsIcon } from "lucide-react"
import { ActionSheet } from "@/components/ui/action-sheet"
import { UserAvatar } from "@/components/ui/user-avatar"
import { nameOf } from "@/features/users/utils/names"
import { formatNaira, shortDate } from "@/lib/format"
import type { MoneyRequest, RequestBox } from "../../types"
import {
  requestCounterparty,
  requestHandle,
  requestHeadline,
  requestState,
} from "../../utils/requests"
import { momentLabel } from "../../utils/transaction-look"
import { DetailLine, DetailLines } from "../shared/detail-line"
import { StatusPill } from "../shared/status-pill"
import { RequestActions } from "./request-actions"

interface RequestDetailProps {
  box: RequestBox
  busy: boolean
  onPay: () => void
  onDecline: () => void
  onCancel: () => void
}

export function RequestDetailSheet({
  open,
  onOpenChange,
  request,
  ...props
}: RequestDetailProps & {
  open: boolean
  onOpenChange: (open: boolean) => void
  request: MoneyRequest | null
}) {
  return (
    <ActionSheet open={open} onOpenChange={onOpenChange} className="px-6 pb-2">
      {request ? (
        <Detail request={request} {...props} />
      ) : (
        <div className="py-10" />
      )}
    </ActionSheet>
  )
}

function Detail({
  request,
  box,
  busy,
  onPay,
  onDecline,
  onCancel,
}: RequestDetailProps & { request: MoneyRequest }) {
  const person = requestCounterparty(request, box)
  const handle = requestHandle(request, box)
  // Read fresh on each render, so a request that lapses while the sheet is open loses its Pay button.
  const state = requestState(request, box)

  return (
    <div className="flex flex-col gap-6 pt-2">
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <UserAvatar
            alt={nameOf(person)}
            className="size-16"
            textClassName="text-2xl"
            avatarUrl={person.avatar_url}
            name={person.username}
          />
          <span className="absolute -right-1 -bottom-1 flex size-7 items-center justify-center rounded-full border-4 border-popover bg-muted">
            <HandCoinsIcon className="size-3.5 text-foreground" />
          </span>
        </div>

        <div className="flex flex-col items-center gap-0.5">
          <p className="text-4xl font-extrabold text-foreground tabular-nums">
            {formatNaira(request.amount)}
          </p>
          <p className="font-bold text-foreground">
            {requestHeadline(request, box)}
          </p>
          <p className="text-sm text-muted-foreground">
            {momentLabel(request.created_at)}
          </p>
        </div>

        {state.open ? null : (
          <StatusPill label={state.label} tone={state.tone} />
        )}
      </div>

      <DetailLines>
        {request.note ? <DetailLine label="For" value={request.note} /> : null}
        <DetailLine label={box === "incoming" ? "From" : "To"} value={handle} />
        {state.open ? (
          <DetailLine label="Expires" value={shortDate(request.expires_at)} />
        ) : request.resolved_at ? (
          <DetailLine
            label={state.label}
            value={shortDate(request.resolved_at)}
          />
        ) : null}
      </DetailLines>

      {!state.open ? null : box === "incoming" ? (
        <RequestActions
          box="incoming"
          busy={busy}
          onPay={onPay}
          onDecline={onDecline}
        />
      ) : (
        <RequestActions box="outgoing" busy={busy} onCancel={onCancel} />
      )}
    </div>
  )
}

import { HandCoinsIcon } from "lucide-react"
import { ActionSheet } from "@/components/ui/action-sheet"
import { UserAvatar } from "@/components/ui/user-avatar"
import { clockTime, formatNaira, shortDate } from "@/lib/format"
import type { MoneyRequest } from "../../types"
import { requestState, type RequestBox } from "../../utils/requests"
import { DetailLine, DetailLines } from "../shared/detail-line"
import { StatusPill } from "../shared/status-pill"
import { RequestActions } from "./request-actions"

export function RequestDetailSheet({
  open,
  onOpenChange,
  request,
  box,
  busy,
  onPay,
  onDecline,
  onCancel,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  request: MoneyRequest | null
  box: RequestBox
  busy: boolean
  onPay: (request: MoneyRequest) => void
  onDecline: (request: MoneyRequest) => void
  onCancel: (request: MoneyRequest) => void
}) {
  return (
    <ActionSheet open={open} onOpenChange={onOpenChange} className="px-6 pb-2">
      {request ? (
        <Detail
          request={request}
          box={box}
          busy={busy}
          onPay={() => onPay(request)}
          onDecline={() => onDecline(request)}
          onCancel={() => onCancel(request)}
        />
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
}: {
  request: MoneyRequest
  box: RequestBox
  busy: boolean
  onPay: () => void
  onDecline: () => void
  onCancel: () => void
}) {
  const incoming = box === "incoming"
  const other = incoming ? request.requester : request.target
  const state = requestState(request, box)

  return (
    <div className="flex flex-col gap-6 pt-2">
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <UserAvatar
            alt={other.display_name ?? "User"}
            className="size-16"
            textClassName="text-2xl"
            avatarUrl={other.avatar_url}
            name={other.username}
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
            {incoming
              ? `@${other.username} asked you`
              : `You asked @${other.username}`}
          </p>
          <p className="text-sm text-muted-foreground">
            {shortDate(request.created_at)} · {clockTime(request.created_at)}
          </p>
        </div>

        {state.open ? null : (
          <StatusPill label={state.label} tone={state.tone} />
        )}
      </div>

      <DetailLines>
        {request.note ? <DetailLine label="For" value={request.note} /> : null}
        <DetailLine
          label={incoming ? "From" : "To"}
          value={`@${other.username}`}
        />
        {state.open ? (
          <DetailLine label="Expires" value={shortDate(request.expires_at)} />
        ) : request.resolved_at ? (
          <DetailLine
            label={state.label}
            value={shortDate(request.resolved_at)}
          />
        ) : null}
      </DetailLines>

      {state.open ? (
        <RequestActions
          busy={busy}
          {...(incoming
            ? { box: "incoming" as const, onPay, onDecline }
            : { box: "outgoing" as const, onCancel })}
        />
      ) : null}
    </div>
  )
}

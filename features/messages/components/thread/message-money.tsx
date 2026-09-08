import {
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
  HandCoinsIcon,
} from "lucide-react"
import { formatNaira } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { MessageMoney as Money } from "../../types"

const REQUEST_STATUS: Record<string, string> = {
  pending: "Waiting",
  paid: "Paid",
  declined: "Declined",
  cancelled: "Cancelled",
  expired: "Expired",
}

export function MessageMoney({
  money,
  note,
  mine,
  onOpen,
  onPay,
  paying = false,
}: {
  money: Money
  note?: string | null
  mine: boolean
  /** Opens the receipt behind a settled transfer. */
  onOpen?: () => void
  /** Pays an open request that was sent to you. */
  onPay?: () => void
  paying?: boolean
}) {
  const request = money.kind === "request"
  const received = !request && !mine
  const strong = mine ? "text-primary-foreground" : "text-foreground"
  const soft = mine ? "text-primary-foreground/70" : "text-muted-foreground"
  const accent = received ? "text-success" : strong
  const label = request
    ? mine
      ? "You asked for"
      : "Asked you for"
    : mine
      ? "You sent"
      : "Sent you"
  const Icon = request
    ? HandCoinsIcon
    : received
      ? ArrowDownLeftIcon
      : ArrowUpRightIcon
  const amount = formatNaira(money.amount)
  const status = request
    ? (REQUEST_STATUS[money.request?.status ?? ""] ?? money.request?.status)
    : null
  const payable =
    request && !mine && money.request?.status === "pending" && Boolean(onPay)
  const openable = !request && Boolean(money.transaction_id) && Boolean(onOpen)

  const body = (
    <>
      <div className="flex items-center gap-1.5">
        <Icon className={cn("size-3.5", accent)} />
        <span
          className={cn("text-[11px] font-bold tracking-wider uppercase", soft)}
        >
          {label}
        </span>
      </div>
      <p
        className={cn(
          "truncate font-extrabold tabular-nums",
          amount.length > 10 ? "text-2xl" : "text-3xl",
          accent
        )}
      >
        {amount}
      </p>
      {note ? (
        <p className={cn("mt-1 line-clamp-3 text-sm leading-5", soft)}>
          {note}
        </p>
      ) : null}
      {status ? (
        <>
          <div
            className={cn(
              "-mx-4 mt-2.5 h-px",
              mine ? "bg-background/20" : "bg-foreground/10"
            )}
          />
          <p className={cn("mt-2 text-xs font-bold", payable ? strong : soft)}>
            {payable ? (paying ? "Paying…" : "Tap to pay") : status}
          </p>
        </>
      ) : null}
    </>
  )

  const className = "min-w-52 px-4 pt-3 pb-3 text-left"
  const aria = `${label} ${amount}`

  if (payable) {
    return (
      <button
        type="button"
        disabled={paying}
        onClick={(event) => {
          event.stopPropagation()
          onPay?.()
        }}
        aria-label={`${aria}. Pay this request`}
        className={cn(
          className,
          "block w-full transition-opacity active:opacity-70"
        )}
      >
        {body}
      </button>
    )
  }

  if (openable) {
    return (
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation()
          onOpen?.()
        }}
        aria-label={`${aria}. Open the receipt`}
        className={cn(
          className,
          "block w-full transition-opacity active:opacity-70"
        )}
      >
        {body}
      </button>
    )
  }

  return (
    <div className={className} aria-label={aria}>
      {body}
    </div>
  )
}

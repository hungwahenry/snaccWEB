import {
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
  HandCoinsIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { MessageMoney as Money } from "../../types"
import { moneyCard } from "../../utils/money"

const CARD = "min-w-52 px-4 pt-3 pb-3 text-left"
const PRESSABLE = "block w-full transition-opacity active:opacity-70"

export function MessageMoney({
  money,
  note,
  mine,
  onOpen,
  onPay,
  paying = false,
  requestExpiryDays,
}: {
  money: Money
  note?: string | null
  mine: boolean
  /** Opens the receipt behind a settled transfer. */
  onOpen?: () => void
  /** Pays an open request that was sent to you. */
  onPay?: () => void
  paying?: boolean
  requestExpiryDays: number
}) {
  const card = moneyCard(money, mine, requestExpiryDays)
  const strong = mine ? "text-primary-foreground" : "text-foreground"
  const soft = mine ? "text-primary-foreground/70" : "text-muted-foreground"
  const accent = card.received ? "text-success" : strong
  const Icon = card.request
    ? HandCoinsIcon
    : card.received
      ? ArrowDownLeftIcon
      : ArrowUpRightIcon
  const payable = card.payable && onPay !== undefined
  const openable = card.openable && onOpen !== undefined
  const aria = `${card.label} ${card.amount}`

  const body = (
    <>
      <div className="flex items-center gap-1.5">
        <Icon className={cn("size-3.5", accent)} />
        <span
          className={cn("text-[11px] font-bold tracking-wider uppercase", soft)}
        >
          {card.label}
        </span>
      </div>
      <p
        className={cn(
          "truncate font-extrabold tabular-nums",
          card.amount.length > 10 ? "text-2xl" : "text-3xl",
          accent
        )}
      >
        {card.amount}
      </p>
      {note ? (
        <p className={cn("mt-1 line-clamp-3 text-sm leading-5", soft)}>
          {note}
        </p>
      ) : null}
      {card.status ? (
        <>
          <div
            className={cn(
              "-mx-4 mt-2.5 h-px",
              mine ? "bg-background/20" : "bg-foreground/10"
            )}
          />
          <p className={cn("mt-2 text-xs font-bold", payable ? strong : soft)}>
            {payable ? (paying ? "Paying…" : "Tap to pay") : card.status}
          </p>
        </>
      ) : null}
    </>
  )

  if (payable || openable) {
    return (
      <button
        type="button"
        disabled={payable && paying}
        onClick={(event) => {
          event.stopPropagation()
          if (payable) onPay?.()
          else onOpen?.()
        }}
        aria-label={`${aria}. ${payable ? "Pay this request" : "Open the receipt"}`}
        className={cn(CARD, PRESSABLE)}
      >
        {body}
      </button>
    )
  }

  return (
    <div className={CARD} aria-label={aria}>
      {body}
    </div>
  )
}

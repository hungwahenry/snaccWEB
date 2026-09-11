import { ReceiptIcon } from "lucide-react"
import type { RefObject } from "react"
import { ActionSheet } from "@/components/ui/action-sheet"
import { Button } from "@/components/ui/button"
import { Eyebrow } from "@/components/ui/eyebrow"
import { LoadFailed } from "@/components/ui/load-failed"
import { Spinner } from "@/components/ui/spinner"
import { UserAvatar } from "@/components/ui/user-avatar"
import { nameOf } from "@/features/users/utils/names"
import { cn } from "@/lib/utils"
import type {
  MoneyTone,
  PayoutDelivery,
  WalletTransactionDetail,
} from "../../types"
import {
  deliveryLine,
  momentLabel,
  sendAgainLabel,
  signedAmount,
  transactionLook,
  transactionRows,
  transactionStatus,
} from "../../utils/transaction-look"
import { DetailLine, DetailLines } from "../shared/detail-line"
import { StatusPill } from "../shared/status-pill"

const DOT: Record<MoneyTone, string> = {
  good: "bg-primary",
  bad: "bg-destructive",
  quiet: "bg-muted-foreground",
  open: "bg-primary",
}

interface ReceiptShare {
  cardRef: RefObject<HTMLDivElement | null>
  busy: boolean
  onShare: () => void
}

export function TransactionDetailSheet({
  open,
  onOpenChange,
  detail,
  loading,
  failed,
  onRetry,
  onSendAgain,
  receipt,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  detail: WalletTransactionDetail | null
  loading: boolean
  failed: boolean
  onRetry: () => void
  onSendAgain: (username: string) => void
  receipt?: ReceiptShare
}) {
  return (
    <ActionSheet open={open} onOpenChange={onOpenChange} className="px-6 pb-2">
      {failed ? (
        <div className="py-10">
          <LoadFailed
            title="Could not load this transaction"
            onRetry={onRetry}
          />
        </div>
      ) : !detail || loading ? (
        <div className="flex justify-center py-10">
          <Spinner className="text-muted-foreground" />
        </div>
      ) : (
        <Receipt detail={detail} receipt={receipt} onSendAgain={onSendAgain} />
      )}
    </ActionSheet>
  )
}

function Receipt({
  detail,
  receipt,
  onSendAgain,
}: {
  detail: WalletTransactionDetail
  receipt?: ReceiptShare
  onSendAgain: (username: string) => void
}) {
  const look = transactionLook(detail)
  const username = detail.counterparty?.username ?? null

  return (
    <div className="flex flex-col gap-6 pt-2">
      <div ref={receipt?.cardRef} className="flex flex-col gap-6 bg-background">
        <div className="flex flex-col items-center gap-3">
          {detail.counterparty ? (
            <UserAvatar
              alt={nameOf(detail.counterparty)}
              className="size-16"
              textClassName="text-2xl"
              avatarUrl={detail.counterparty.avatar_url}
              name={detail.counterparty.username}
            />
          ) : (
            <span
              className={cn(
                "flex size-16 items-center justify-center rounded-full",
                look.tile
              )}
            >
              <look.icon className={cn("size-7", look.glyph)} />
            </span>
          )}
          <div className="flex flex-col items-center gap-0.5">
            <span
              className={cn(
                "text-4xl font-extrabold tabular-nums",
                look.amount
              )}
            >
              {signedAmount(detail.direction, detail.amount)}
            </span>
            <span className="font-bold text-foreground">{detail.label}</span>
            <span className="text-sm text-muted-foreground">
              {momentLabel(detail.created_at)}
            </span>
          </div>
          <StatusPill {...transactionStatus(detail.status)} />
        </div>

        <DetailLines>
          {transactionRows(detail).map((row) => (
            <DetailLine key={row.label} {...row} />
          ))}
        </DetailLines>

        {detail.delivery ? <Delivery delivery={detail.delivery} /> : null}
      </div>

      {username ? (
        <Button
          size="lg"
          className="h-14 text-base"
          onClick={() => onSendAgain(username)}
        >
          {sendAgainLabel(detail.direction)}
        </Button>
      ) : null}
      {receipt ? (
        <Button
          variant="ghost"
          size="lg"
          className="h-12 text-base"
          disabled={receipt.busy}
          onClick={receipt.onShare}
        >
          {receipt.busy ? <Spinner /> : <ReceiptIcon />} Share receipt
        </Button>
      ) : null}
    </div>
  )
}

function Delivery({ delivery }: { delivery: PayoutDelivery }) {
  return (
    <div className="flex flex-col gap-3">
      <Eyebrow>Delivery</Eyebrow>
      <p className="font-bold text-foreground">{deliveryLine(delivery)}</p>
      <div className="flex flex-col gap-2">
        {delivery.timeline.map((step, index) => {
          const status = transactionStatus(step.status)
          return (
            <div key={index} className="flex items-center gap-2">
              <span className={cn("size-2 rounded-full", DOT[status.tone])} />
              <span className="flex-1 text-sm text-foreground">
                {status.label}
              </span>
              <span className="text-xs text-muted-foreground">
                {momentLabel(step.at)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

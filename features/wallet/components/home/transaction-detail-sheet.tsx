import { ReceiptIcon } from "lucide-react"
import type { RefObject } from "react"
import { ActionSheet } from "@/components/ui/action-sheet"
import { Button } from "@/components/ui/button"
import { Eyebrow } from "@/components/ui/eyebrow"
import { LoadFailed } from "@/components/ui/load-failed"
import { Spinner } from "@/components/ui/spinner"
import { UserAvatar } from "@/components/ui/user-avatar"
import { clockTime, formatNaira, shortDate } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { WalletTransactionDetail } from "../../types"
import type { MoneyTone } from "../../utils/requests"
import {
  transactionLook,
  transactionStatus,
} from "../../utils/transaction-look"
import { DetailLine, DetailLines } from "../shared/detail-line"
import { StatusPill } from "../shared/status-pill"

const CHANNEL_LABEL: Record<string, string> = {
  bank_transfer: "Bank transfer",
  dedicated_nuban: "Your account number",
}

const DOT: Record<MoneyTone, string> = {
  good: "bg-primary",
  bad: "bg-destructive",
  quiet: "bg-muted-foreground",
  open: "bg-primary",
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
  receipt?: {
    cardRef: RefObject<HTMLDivElement | null>
    busy: boolean
    onShare: () => void
  }
}) {
  const look = detail ? transactionLook(detail) : null

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
        <div className="flex flex-col gap-6 pt-2">
          <div
            ref={receipt?.cardRef}
            className="flex flex-col gap-6 bg-background"
          >
            <div className="flex flex-col items-center gap-3">
              {detail.counterparty ? (
                <UserAvatar
                  alt={detail.counterparty.display_name ?? "User"}
                  className="size-16"
                  textClassName="text-2xl"
                  avatarUrl={detail.counterparty.avatar_url}
                  name={detail.counterparty.username}
                />
              ) : (
                <span
                  className={cn(
                    "flex size-16 items-center justify-center rounded-full",
                    look?.tile
                  )}
                >
                  {look ? (
                    <look.icon className={cn("size-7", look.glyph)} />
                  ) : null}
                </span>
              )}
              <div className="flex flex-col items-center gap-0.5">
                <span
                  className={cn(
                    "text-4xl font-extrabold tabular-nums",
                    look?.amount
                  )}
                >
                  {detail.direction === "out" ? "−" : "+"}
                  {formatNaira(detail.amount)}
                </span>
                <span className="font-bold text-foreground">
                  {detail.label}
                </span>
                <span className="text-sm text-muted-foreground">
                  {shortDate(detail.created_at)} ·{" "}
                  {clockTime(detail.created_at)}
                </span>
              </div>
              <StatusPill {...transactionStatus(detail.status)} />
            </div>

            <DetailLines>
              {detail.context?.kind === "request" ? (
                <DetailLine
                  label="For"
                  value={detail.context.note ?? "A request"}
                />
              ) : null}
              {detail.context?.kind === "conversation" ? (
                <DetailLine label="Sent from" value="A DM" />
              ) : null}
              {detail.channel ? (
                <DetailLine
                  label="Via"
                  value={CHANNEL_LABEL[detail.channel] ?? detail.channel}
                />
              ) : null}
              {detail.fee > 0 ? (
                <DetailLine label="Fee" value={formatNaira(detail.fee)} />
              ) : null}
              {detail.fee > 0 ? (
                <DetailLine label="Total" value={formatNaira(detail.total)} />
              ) : null}
              <DetailLine
                label="Balance after"
                value={formatNaira(detail.balance_after)}
              />
              <DetailLine label="Reference" value={detail.reference} mono />
            </DetailLines>

            {detail.delivery ? <Delivery delivery={detail.delivery} /> : null}
          </div>

          {detail.counterparty?.username ? (
            <Button
              size="lg"
              className="h-14 text-base"
              onClick={() => onSendAgain(detail.counterparty!.username!)}
            >
              {detail.direction === "out" ? "Send again" : "Send back"}
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
      )}
    </ActionSheet>
  )
}

function Delivery({
  delivery,
}: {
  delivery: NonNullable<WalletTransactionDetail["delivery"]>
}) {
  return (
    <div className="flex flex-col gap-3">
      <Eyebrow>Delivery</Eyebrow>
      <p className="font-bold text-foreground">
        {delivery.account_name} · {delivery.bank_name} ••
        {delivery.account_last4}
      </p>
      <div className="flex flex-col gap-2">
        {delivery.timeline.map((step, index) => (
          <div key={index} className="flex items-center gap-2">
            <span
              className={cn(
                "size-2 rounded-full",
                DOT[transactionStatus(step.status).tone]
              )}
            />
            <span className="flex-1 text-sm text-foreground">
              {transactionStatus(step.status).label}
            </span>
            <span className="text-xs text-muted-foreground">
              {shortDate(step.at)} · {clockTime(step.at)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

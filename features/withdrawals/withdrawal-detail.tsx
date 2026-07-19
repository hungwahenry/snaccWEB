"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { formatDate, formatNaira } from "@/lib/format"
import { STATUS_VARIANT } from "./withdrawals-table"
import type { useWithdrawalMutations } from "./use-withdrawals"
import type { AdminWithdrawal, SettleWithdrawalInput } from "./types"

type Mutations = ReturnType<typeof useWithdrawalMutations>

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  )
}

function SettleDialog({ actions }: { actions: Mutations }) {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<SettleWithdrawalInput["status"]>("success")
  const [reason, setReason] = useState("")

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm">
            Mark settled
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settle withdrawal</DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground text-sm">
          Manually record the outcome. Reversing a successful transfer refunds the balance once.
        </p>
        <Field>
          <FieldLabel>Outcome</FieldLabel>
          <Select value={status} onValueChange={(value) => value && setStatus(value as never)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="reversed">Reversed</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel>Reason (optional)</FieldLabel>
          <Textarea
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            rows={3}
            maxLength={200}
          />
        </Field>
        <DialogFooter>
          <DialogClose render={<Button variant="ghost">Cancel</Button>} />
          <Button
            disabled={actions.settle.isPending}
            onClick={() =>
              actions.settle.mutate(
                { status, reason: reason.trim() || undefined },
                { onSuccess: () => setOpen(false) },
              )
            }
          >
            Settle
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function WithdrawalDetail({
  withdrawal,
  actions,
}: {
  withdrawal: AdminWithdrawal
  actions: Mutations
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold tabular-nums">{formatNaira(withdrawal.amount)}</h2>
            <Badge variant={STATUS_VARIANT[withdrawal.status]}>{withdrawal.status}</Badge>
          </div>
          <p className="text-muted-foreground font-mono text-xs">{withdrawal.reference}</p>
          <p className="text-muted-foreground text-sm">
            {withdrawal.user.username
              ? `@${withdrawal.user.username}`
              : withdrawal.user.display_name}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {withdrawal.status === "pending" && (
            <Button
              size="sm"
              disabled={actions.retry.isPending}
              onClick={() => actions.retry.mutate()}
            >
              Retry transfer
            </Button>
          )}
          <SettleDialog actions={actions} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Payout</CardTitle>
          </CardHeader>
          <CardContent className="divide-y">
            <Row label="Bank" value={withdrawal.bank_name} />
            <Row label="Account name" value={withdrawal.account_name} />
            <Row label="Account" value={`•••• ${withdrawal.account_last4}`} />
            <Row label="Balance before" value={formatNaira(withdrawal.balance_before)} />
            <Row label="Balance after" value={formatNaira(withdrawal.balance_after)} />
            <Row label="Transfer code" value={withdrawal.transfer_code ?? "—"} />
            <Row label="Failure reason" value={withdrawal.failure_reason ?? "—"} />
            <Row label="Requested" value={formatDate(withdrawal.created_at)} />
            <Row label="Completed" value={formatDate(withdrawal.completed_at)} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            {withdrawal.events.length === 0 ? (
              <p className="text-muted-foreground text-sm">No events recorded.</p>
            ) : (
              <ol className="flex flex-col gap-3">
                {withdrawal.events.map((event, index) => (
                  <li key={index} className="flex items-center justify-between gap-4 text-sm">
                    <Badge variant="outline">{event.status}</Badge>
                    <span className="text-muted-foreground text-xs">
                      {formatDate(event.created_at)}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

"use client"

import { ConfirmAction } from "@/components/admin/confirm-action"
import { DetailHeader, Fact, Facts, Section } from "@/components/admin/detail"
import { UserInline } from "@/components/admin/user-inline"
import { Badge } from "@/components/ui/badge"
import { formatDate, formatNaira } from "@/lib/format"
import { STATUS_VARIANT } from "./withdrawals-table"
import type { useWithdrawalMutations } from "./use-withdrawals"
import type { AdminWithdrawal } from "./types"

export function WithdrawalDetail({
  withdrawal,
  actions,
}: {
  withdrawal: AdminWithdrawal
  actions: ReturnType<typeof useWithdrawalMutations>
}) {
  return (
    <div className="flex flex-col gap-6">
      <DetailHeader
        title={formatNaira(withdrawal.amount)}
        badges={
          <Badge variant={STATUS_VARIANT[withdrawal.status]}>
            {withdrawal.status}
          </Badge>
        }
        meta={
          <>
            <span className="font-mono">{withdrawal.reference}</span>
            <span>Requested {formatDate(withdrawal.created_at)}</span>
            {withdrawal.completed_at ? (
              <span>Completed {formatDate(withdrawal.completed_at)}</span>
            ) : null}
          </>
        }
        actions={
          withdrawal.status === "pending" ? (
            <ConfirmAction
              label="Send to Paystack again"
              variant="default"
              confirmVariant="default"
              title="Re-attempt this transfer?"
              description="Paystack is asked to move the money again. If the first attempt actually succeeded, this could pay twice — check the timeline before confirming."
              confirmLabel="Send again"
              pending={actions.retry.isPending}
              onConfirm={(close) =>
                actions.retry.mutate(undefined, { onSuccess: close })
              }
            />
          ) : null
        }
      />

      <div className="rounded-lg border px-4 py-3">
        <UserInline user={withdrawal.user} note="Requested by" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Where it went">
          <Facts>
            <Fact label="Bank" value={withdrawal.bank_name} />
            <Fact label="Account name" value={withdrawal.account_name} />
            <Fact
              label="Account"
              value={
                withdrawal.account_number ?? `•••• ${withdrawal.account_last4}`
              }
            />
            <Fact
              label="Recipient code"
              value={withdrawal.recipient_code ?? "—"}
              mono
            />
            <Fact
              label="Transfer code"
              value={withdrawal.transfer_code ?? "—"}
              mono
            />
            {withdrawal.failure_reason ? (
              <Fact
                label="Failure reason"
                value={
                  <span className="text-destructive">
                    {withdrawal.failure_reason}
                  </span>
                }
              />
            ) : null}
          </Facts>
        </Section>

        <Section
          title="Timeline"
          description="Balance moved from what it was before to what it is now."
        >
          <Facts>
            <Fact
              label="Balance before"
              value={formatNaira(withdrawal.balance_before)}
            />
            <Fact
              label="Balance after"
              value={formatNaira(withdrawal.balance_after)}
            />
            {withdrawal.events.length === 0 ? (
              <Fact label="Events" value="None recorded" />
            ) : (
              withdrawal.events.map((event, index) => (
                <Fact
                  key={`${event.status}-${index}`}
                  label={
                    <Badge variant="outline" className="capitalize">
                      {event.status}
                    </Badge>
                  }
                  value={formatDate(event.created_at)}
                />
              ))
            )}
          </Facts>
        </Section>
      </div>
    </div>
  )
}

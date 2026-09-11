"use client"

import { Button } from "@/components/ui/button"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import { ConfirmAction } from "@/features/admin/shell/components/confirm-action"
import {
  DetailHeader,
  Fact,
  Facts,
  Section,
} from "@/features/admin/shell/components/detail"
import { StatusBadge } from "@/features/admin/shell/components/status-badge"
import { UserCell } from "@/features/admin/shell/components/user-cell"
import { formatDate, formatNaira } from "@/lib/format"
import type { AdminWithdrawal } from "../types"
import { WITHDRAWAL_STATUS } from "../utils/status"
import { accountLine, canRetry } from "../utils/withdrawals"

export function WithdrawalDetail({
  withdrawal,
  onRetry,
}: {
  withdrawal: AdminWithdrawal
  onRetry: () => Promise<unknown>
}) {
  return (
    <div className="flex flex-col gap-6">
      <DetailHeader
        title={formatNaira(withdrawal.amount)}
        badges={<StatusBadge status={WITHDRAWAL_STATUS[withdrawal.status]} />}
        meta={
          <>
            <span className="font-mono">{withdrawal.reference}</span>
            <span>Asked for {formatDate(withdrawal.created_at)}</span>
            {withdrawal.completed_at ? (
              <span>Finished {formatDate(withdrawal.completed_at)}</span>
            ) : null}
          </>
        }
        actions={
          canRetry(withdrawal) ? (
            <CanAct permission="withdrawals.process">
              <ConfirmAction
                trigger={<Button size="sm">Send to Paystack again</Button>}
                tone="default"
                title="Try this transfer again?"
                description="Paystack is asked to move the money again. If the first try actually went through, this could pay twice, so check the timeline before you confirm."
                confirmLabel="Send again"
                onConfirm={() => onRetry()}
              />
            </CanAct>
          ) : null
        }
      />

      <div className="rounded-lg border px-4 py-3">
        <UserCell user={withdrawal.user} note="Asked for by" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Where it went">
          <Facts>
            <Fact label="Bank" value={withdrawal.bank_name} />
            <Fact label="Account name" value={withdrawal.account_name} />
            <Fact label="Account" value={accountLine(withdrawal)} />
            <Fact
              label="Recipient code"
              value={withdrawal.recipient_code}
              mono
            />
            <Fact
              label="Transfer code"
              value={withdrawal.transfer_code ?? "—"}
              mono
            />
            {withdrawal.failure_reason ? (
              <Fact
                label="Why it failed"
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
          description="What their balance was before and after, and each step Paystack reported."
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
              <Fact label="Steps" value="None recorded" />
            ) : (
              withdrawal.events.map((event, index) => (
                <Fact
                  key={`${event.status}-${index}`}
                  label={
                    <StatusBadge status={WITHDRAWAL_STATUS[event.status]} />
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

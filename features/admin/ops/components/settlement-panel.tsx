"use client"

import { Button } from "@/components/ui/button"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import { ConfirmAction } from "@/features/admin/shell/components/confirm-action"
import { Section } from "@/features/admin/shell/components/detail"

export function SettlementPanel({
  onReconcile,
}: {
  onReconcile: () => Promise<unknown>
}) {
  return (
    <Section
      title="Paystack settlement"
      action={
        <CanAct permission="ops.run">
          <ConfirmAction
            trigger={
              <Button variant="outline" size="sm">
                Check with Paystack now
              </Button>
            }
            tone="default"
            title="Ask Paystack about everything unsettled?"
            description="Withdrawals and top-ups still in flight are checked one by one, and any that have settled are applied. This moves money, so run it when you actually suspect a missed webhook."
            confirmLabel="Check now"
            onConfirm={() => onReconcile()}
          />
        </CanAct>
      }
    >
      <p className="text-sm text-pretty text-muted-foreground">
        Withdrawals and top-ups normally settle the moment Paystack calls us
        back. Every ten minutes Snacc also asks Paystack directly about anything
        still unsettled, so money lands even when that call never arrives. This
        brings that check forward.
      </p>
    </Section>
  )
}

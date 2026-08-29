"use client"

import { useState } from "react"
import { Section } from "@/components/admin/detail"
import { CanAct } from "@/components/rbac/can"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { useWalletMutations } from "../hooks/use-wallet"

export function WalletAdjustForm({
  actions,
}: {
  actions: ReturnType<typeof useWalletMutations>
}) {
  const [delta, setDelta] = useState("")
  const [reason, setReason] = useState("")

  const kobo = Math.round(Number(delta) * 100)
  const ready =
    delta.trim().length > 0 &&
    Number.isFinite(kobo) &&
    kobo !== 0 &&
    reason.trim().length > 0

  return (
    <Section
      title="Adjust"
      description="Posts against the adjustments pool, so the entries still explain the balance."
    >
      <div className="flex flex-col gap-3 rounded-lg border p-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="delta">Amount in naira</Label>
          <Input
            id="delta"
            inputMode="decimal"
            placeholder="-500 to take money back"
            value={delta}
            onChange={(event) => setDelta(event.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="reason">Reason</Label>
          <Input
            id="reason"
            placeholder="Why this is being moved"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
          />
        </div>
        <CanAct permission="wallet.adjust">
          <Button
            disabled={!ready || actions.adjust.isPending}
            onClick={() =>
              actions.adjust.mutate(
                { delta: kobo, reason: reason.trim() },
                {
                  onSuccess: () => {
                    setDelta("")
                    setReason("")
                  },
                }
              )
            }
          >
            Post adjustment
          </Button>
        </CanAct>
      </div>
    </Section>
  )
}

"use client"

import { useState } from "react"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import { ActionButton } from "@/features/admin/shell/components/action-button"
import { Section } from "@/features/admin/shell/components/detail"
import { TextField } from "@/features/admin/shell/components/form-fields"
import { previewAdjustment } from "@/features/admin/shell/utils/money"
import type { AdjustWalletInput } from "../types"
import { ADJUST_REASON_MAX, adjustHint, toAdjustInput } from "../utils/wallet"

export function WalletAdjustForm({
  balance,
  onSubmit,
}: {
  balance: number
  onSubmit: (input: AdjustWalletInput) => Promise<unknown>
}) {
  const [amount, setAmount] = useState("")
  const [reason, setReason] = useState("")
  const preview = previewAdjustment(balance, amount)
  const input = toAdjustInput(preview, reason)

  async function submit() {
    if (!input) return
    await onSubmit(input)
    setAmount("")
    setReason("")
  }

  return (
    <Section
      title="Adjust"
      description="Posts against the adjustments pool, so the entries still explain the balance."
    >
      <div className="flex flex-col gap-3 rounded-lg border p-4">
        <TextField
          label="Amount in naira"
          inputMode="decimal"
          placeholder="-500 to take money back"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          hint={adjustHint(balance, preview)}
        />
        <TextField
          label="Reason"
          placeholder="Why this is being moved"
          maxLength={ADJUST_REASON_MAX}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
        />
        <CanAct permission="wallet.adjust">
          <ActionButton disabled={!input} onClick={submit}>
            Post adjustment
          </ActionButton>
        </CanAct>
      </div>
    </Section>
  )
}

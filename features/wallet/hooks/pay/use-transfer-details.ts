"use client"

import { useNow } from "@/hooks/use-now"
import type { DepositAccount } from "../../types"
import { countdownLabel, secondsUntil } from "../../utils/countdown"
import { useCopyFeedback } from "@/hooks/use-copy-feedback"

export function useTransferDetails(transfer: DepositAccount) {
  const now = useNow(1000)
  const left = secondsUntil(transfer.expires_at, now)
  const { copied, copy } = useCopyFeedback(transfer.account_number)

  return {
    expired: left === 0,
    timeLeft: countdownLabel(left),
    copied,
    onCopy: copy,
  }
}

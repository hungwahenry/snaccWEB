"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { payPath } from "../../routes"
import type { WalletTransaction } from "../../types"
import { useReceiptShare } from "./use-receipt-share"
import { useTransactionDetail } from "./use-transaction-detail"

export function useTransactionSheet() {
  const router = useRouter()
  const [transactionId, setTransactionId] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const detail = useTransactionDetail(open ? transactionId : null)
  const receipt = useReceiptShare()

  return {
    open: (transaction: WalletTransaction) => {
      setTransactionId(transaction.id)
      setOpen(true)
    },
    sheet: {
      open,
      onOpenChange: setOpen,
      detail: detail.data ?? null,
      loading: detail.isLoading,
      failed: detail.isError,
      onRetry: () => void detail.refetch(),
      receipt,
      onSendAgain: (username: string) => {
        setOpen(false)
        router.push(payPath({ mode: "send", to: username }))
      },
    },
  }
}

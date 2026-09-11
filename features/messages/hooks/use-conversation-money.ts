"use client"

import { useConfigValue } from "@/features/config/hooks/use-config-value"
import { BanknoteIcon, HandCoinsIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useCallback, useState } from "react"
import { useFlag } from "@/features/config/hooks/use-flag"
import { useReceiptShare } from "@/features/wallet/hooks/history/use-receipt-share"
import { useTransactionDetail } from "@/features/wallet/hooks/history/use-transaction-detail"
import { useRequestActions } from "@/features/wallet/hooks/requests/use-request-actions"
import { payPath } from "@/features/wallet/routes"
import type { ComposerAction } from "../types"

/** Money inside a DM: the send and request entries, a sent payment's receipt, paying a request. */
export function useConversationMoney(
  conversationId: string,
  otherUsername: string | null
) {
  const router = useRouter()
  const walletEnabled = useFlag("wallet")
  const requests = useRequestActions({ enabled: walletEnabled })
  const requestExpiryDays = useConfigValue("wallet.request.expiry_days")
  const receipt = useReceiptShare()
  const [detailId, setDetailId] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const detail = useTransactionDetail(open ? detailId : null)

  const payTo = useCallback(
    (mode: "send" | "request", to: string) =>
      router.push(payPath({ mode, to, conversation: conversationId })),
    [router, conversationId]
  )

  const actions: ComposerAction[] =
    walletEnabled && otherUsername
      ? [
          {
            key: "send",
            icon: BanknoteIcon,
            label: "Send money",
            hint: "From your wallet",
            onPress: () => payTo("send", otherUsername),
          },
          {
            key: "request",
            icon: HandCoinsIcon,
            label: "Request money",
            hint: "Ask for an amount",
            onPress: () => payTo("request", otherUsername),
          },
        ]
      : []

  const openReceipt = useCallback((transactionId: string) => {
    setDetailId(transactionId)
    setOpen(true)
  }, [])

  return {
    actions,
    openReceipt,
    payRequest: requests.pay,
    payingRequestIds: requests.payingIds,
    requestExpiryDays,
    detailSheet: {
      open,
      onOpenChange: setOpen,
      detail: detail.data ?? null,
      loading: detail.isLoading,
      failed: detail.isError,
      onRetry: () => void detail.refetch(),
      receipt,
      onSendAgain: (username: string) => {
        setOpen(false)
        payTo("send", username)
      },
    },
  }
}

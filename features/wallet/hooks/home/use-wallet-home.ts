"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { confirm } from "@/components/ui/confirm"
import { useFlag } from "@/features/config/hooks/use-flag"
import { PAY_LINK_PATH, payPath, RECEIVE_PATH } from "../../routes"
import type {
  MoneyRequest,
  WalletRecipient,
  WalletTransaction,
} from "../../types"
import { isOpenRequest } from "../../utils/requests"
import { useWalletOverview } from "../account/use-wallet-overview"
import { useWalletTransactions } from "../history/use-wallet-transactions"
import { useHideBalance } from "../lock/use-hide-balance"
import { useRecipients, useRemoveRecipient } from "../pay/use-recipients"
import { useVirtualAccount } from "../receive/use-virtual-account"
import { useRequestActions } from "../requests/use-request-actions"
import { useRequests } from "../requests/use-requests"

export function useWalletHome() {
  const router = useRouter()
  const overview = useWalletOverview()
  const transactions = useWalletTransactions({})
  const removeRecipient = useRemoveRecipient()

  const recipients = useRecipients()
  const incoming = useRequests("incoming")
  const requestActions = useRequestActions()
  const balancePrivacy = useHideBalance()
  const earningsEnabled = useFlag("earnings")
  const accountNumberEnabled = useFlag("wallet_dva")
  const virtualAccount = useVirtualAccount({ enabled: accountNumberEnabled })

  const [detailId, setDetailId] = useState<string | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [openRequest, setOpenRequest] = useState<MoneyRequest | null>(null)
  const [requestOpen, setRequestOpen] = useState(false)

  const open = incoming.items.filter(isOpenRequest)
  const pending = open.slice(0, 2)

  const loading =
    overview.isLoading ||
    recipients.isLoading ||
    incoming.loading ||
    transactions.loading ||
    (accountNumberEnabled && virtualAccount.isLoading)

  function forgetRecipient(recipient: WalletRecipient) {
    const name =
      recipient.kind === "user"
        ? `@${recipient.user?.username ?? ""}`
        : `${recipient.bank?.bank_name ?? "this account"} ••${recipient.bank?.account_last4 ?? ""}`
    confirm({
      title: `Remove ${name} from recents?`,
      actions: [
        {
          label: "Remove",
          destructive: true,
          onPress: () => removeRecipient.mutate(recipient.id),
        },
      ],
    })
  }

  function fromSheet(act: (request: MoneyRequest) => void) {
    return (request: MoneyRequest) => {
      setRequestOpen(false)
      act(request)
    }
  }

  return {
    loading,
    overview,
    transactions,
    recipients: recipients.data ?? [],
    pending,
    requestActions,
    balancePrivacy,
    earningsEnabled,
    accountNumberEnabled,
    virtualAccount: accountNumberEnabled ? virtualAccount : null,
    detail: { id: detailId, open: detailOpen, onOpenChange: setDetailOpen },
    openDetail: (transaction: WalletTransaction) => {
      setDetailId(transaction.id)
      setDetailOpen(true)
    },
    request: {
      value: openRequest,
      open: requestOpen,
      onOpenChange: setRequestOpen,
    },
    showRequest: (request: MoneyRequest) => {
      setOpenRequest(request)
      setRequestOpen(true)
    },
    fromSheet,
    openRecipient: (recipient: WalletRecipient) =>
      router.push(payPath({ mode: "send", recipient: recipient.id })),
    forgetRecipient,
    refresh: () => {
      void overview.refetch()
      void recipients.refetch()
      incoming.refresh()
      transactions.refresh()
    },
    onSend: () => router.push(payPath({ mode: "send" })),
    onRequest: () => router.push(payPath({ mode: "request" })),
    onTopUp: () => router.push(payPath({ mode: "topup" })),
    onReceive: () => router.push(RECEIVE_PATH),
    onPayLink: () => router.push(PAY_LINK_PATH),
  }
}

export type WalletHome = ReturnType<typeof useWalletHome>

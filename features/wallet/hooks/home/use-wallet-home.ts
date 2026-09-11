"use client"

import { useRouter } from "next/navigation"
import { useMemo } from "react"
import { useFlag } from "@/features/config/hooks/use-flag"
import { earningsLine } from "@/features/earnings/utils/milestones"
import { usePendingVariables } from "@/hooks/use-pending-variables"
import { copyLink } from "@/lib/share-links"
import { PAY_LINK_PATH, payPath, RECEIVE_PATH } from "../../routes"
import type { PayMode, WalletRecipient } from "../../types"
import { balanceText, groupAccountNumber } from "../../utils/format"
import { toHistoryRows } from "../../utils/history"
import { walletMutationKeys } from "../../utils/keys"
import { openRequests } from "../../utils/requests"
import { activeAccountNumber } from "../../utils/virtual-account"
import { useWalletOverview } from "../account/use-wallet-overview"
import { useTransactionSheet } from "../history/use-transaction-sheet"
import { useWalletTransactions } from "../history/use-wallet-transactions"
import { useForgetRecipient, useRecipients } from "../pay/use-recipients"
import { useVirtualAccount } from "../receive/use-virtual-account"
import { useRequestSheet } from "../requests/use-request-sheet"
import { useRequests } from "../requests/use-requests"
import { useHideBalance } from "./use-hide-balance"

const RECENT = 6
const PENDING_SHOWN = 2

export type AccountFooterView =
  | { kind: "number"; number: string; bankName: string; onCopy: () => void }
  | { kind: "invite"; pending: boolean }

export function useWalletHome() {
  const router = useRouter()
  const overview = useWalletOverview()
  const transactions = useWalletTransactions()
  const recipients = useRecipients()
  const incoming = useRequests("incoming")
  const accountNumberEnabled = useFlag("wallet_dva")
  const virtualAccount = useVirtualAccount({ enabled: accountNumberEnabled })
  const earningsEnabled = useFlag("earnings")
  const privacy = useHideBalance()
  const forgetRecipient = useForgetRecipient()
  const removing = usePendingVariables<WalletRecipient>(
    walletMutationKeys.removeRecipient()
  )
  const requestSheet = useRequestSheet()
  const transactionSheet = useTransactionSheet()

  const rows = useMemo(
    () => toHistoryRows(transactions.items.slice(0, RECENT)),
    [transactions.items]
  )
  const pending = useMemo(
    () => openRequests(incoming.items).slice(0, PENDING_SHOWN),
    [incoming.items]
  )

  const data = overview.data
  const loading =
    overview.isLoading ||
    recipients.isLoading ||
    incoming.loading ||
    transactions.loading ||
    (accountNumberEnabled && virtualAccount.isLoading)
  const listLoading = transactions.loading || transactions.stale
  const pay = (mode: PayMode) => router.push(payPath({ mode }))

  const accountNumber = activeAccountNumber(virtualAccount.data)
  const footer: AccountFooterView | null =
    !accountNumberEnabled || virtualAccount.isPending || virtualAccount.isError
      ? null
      : accountNumber
        ? {
            kind: "number",
            number: groupAccountNumber(accountNumber),
            bankName: virtualAccount.data?.bank_name ?? "",
            onCopy: () => void copyLink(accountNumber, "Account number"),
          }
        : { kind: "invite", pending: virtualAccount.data?.status === "pending" }

  return {
    loading,
    skeleton: {
      accountNumber: accountNumberEnabled,
      earnings: earningsEnabled,
    },
    failed: !data,
    retry: () => void overview.refetch(),
    card: data
      ? {
          balance: balanceText(data.balance, privacy.hidden),
          hidden: privacy.hidden,
          onToggleHidden: privacy.toggle,
          frozen: data.frozen,
          showAccount: accountNumberEnabled,
          footer,
          onSend: () => pay("send"),
          onRequest: () => pay("request"),
          onTopUp: () => pay("topup"),
          onReceive: () => router.push(RECEIVE_PATH),
          onPayLink: () => router.push(PAY_LINK_PATH),
        }
      : null,
    pending: {
      requests: pending,
      isBusy: requestSheet.actions.isBusy,
      onOpen: requestSheet.open,
      onPay: requestSheet.actions.pay,
      onDecline: requestSheet.actions.decline,
    },
    recipients: {
      items: (recipients.data ?? []).filter(
        (recipient) => !removing.some((gone) => gone.id === recipient.id)
      ),
      onPress: (recipient: WalletRecipient) =>
        router.push(payPath({ mode: "send", recipient: recipient.id })),
      onLongPress: forgetRecipient,
    },
    earnings:
      earningsEnabled && data ? { line: earningsLine(data.earnings) } : null,
    activity: {
      rows,
      loading: listLoading,
      more: transactions.hasMore || transactions.items.length > RECENT,
      firstRun: rows.length === 0 && !listLoading && data?.balance === 0,
      onOpen: transactionSheet.open,
      onTopUp: () => pay("topup"),
    },
    transactionSheet: transactionSheet.sheet,
    requestSheet: { ...requestSheet.sheet, box: "incoming" as const },
  }
}

export type WalletHomeProps = ReturnType<typeof useWalletHome>

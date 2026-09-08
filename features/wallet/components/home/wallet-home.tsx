"use client"

import { ArrowLeftRightIcon, ChevronRightIcon } from "lucide-react"
import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { LoadFailed } from "@/components/ui/load-failed"
import { Spinner } from "@/components/ui/spinner"
import { useTransactionDetail } from "../../hooks/history/use-transaction-detail"
import { useReceiptShare } from "../../hooks/history/use-receipt-share"
import type { WalletHome as WalletHomeState } from "../../hooks/home/use-wallet-home"
import { toHistoryRows } from "../../utils/history-sections"
import { RequestDetailSheet } from "../requests/request-detail-sheet"
import { BalanceCard } from "./balance-card"
import { EarningsLinkCard } from "./earnings-link-card"
import { HistoryRows } from "./history-rows"
import { PendingRequestCard } from "./pending-request-card"
import { RecipientsStrip } from "./recipients-strip"
import { TransactionDetailSheet } from "./transaction-detail-sheet"
import { WalletHomeSkeleton } from "./wallet-home-skeleton"

const RECENT = 6

export function WalletHome({
  home,
  onOpenTransactions,
  onSendAgain,
}: {
  home: WalletHomeState
  onOpenTransactions: () => void
  onSendAgain: (username: string) => void
}) {
  const rows = useMemo(
    () => toHistoryRows(home.transactions.items.slice(0, RECENT)),
    [home.transactions.items]
  )
  const detail = useTransactionDetail(home.detail.open ? home.detail.id : null)
  const receipt = useReceiptShare()
  const more =
    home.transactions.hasMore || home.transactions.items.length > RECENT

  if (home.loading)
    return (
      <WalletHomeSkeleton
        accountNumber={home.accountNumberEnabled}
        earnings={home.earningsEnabled}
      />
    )
  if (home.overview.isError || !home.overview.data) {
    return (
      <div className="py-24">
        <LoadFailed
          title="Could not load your wallet"
          onRetry={() => void home.overview.refetch()}
        />
      </div>
    )
  }

  const data = home.overview.data
  const listLoading = home.transactions.loading || home.transactions.stale
  const firstRun = rows.length === 0 && !listLoading && data.balance === 0

  return (
    <>
      <div className="flex flex-col gap-6 pt-4 pb-2">
        <BalanceCard
          overview={data}
          hidden={home.balancePrivacy.hidden}
          onToggleHidden={home.balancePrivacy.toggle}
          account={
            home.virtualAccount
              ? {
                  data: home.virtualAccount.data ?? null,
                  ready:
                    !home.virtualAccount.isLoading &&
                    !home.virtualAccount.isError,
                }
              : null
          }
          onSend={home.onSend}
          onRequest={home.onRequest}
          onTopUp={home.onTopUp}
          onReceive={home.onReceive}
          onPayLink={home.onPayLink}
        />

        {home.pending.length > 0 ? (
          <div className="flex flex-col gap-3 px-6">
            {home.pending.map((request) => (
              <PendingRequestCard
                key={request.id}
                request={request}
                paying={home.requestActions.busyId === request.id}
                onPress={home.showRequest}
                onPay={home.requestActions.pay}
                onDecline={home.requestActions.decline}
              />
            ))}
          </div>
        ) : null}

        <RecipientsStrip
          recipients={home.recipients}
          onPress={home.openRecipient}
          onLongPress={home.forgetRecipient}
        />

        {home.earningsEnabled ? (
          <div className="px-6">
            <EarningsLinkCard earnings={data.earnings} />
          </div>
        ) : null}

        {firstRun ? null : (
          <p className="px-6 pt-1 text-xs font-bold tracking-wide text-muted-foreground uppercase">
            Recent activity
          </p>
        )}
      </div>

      {listLoading ? (
        <div className="flex justify-center py-10">
          <Spinner className="text-muted-foreground" />
        </div>
      ) : firstRun ? (
        <div className="flex flex-col items-center gap-5 px-10 py-8">
          <EmptyState
            icon={ArrowLeftRightIcon}
            title="Your money lives here"
            description="Send to anyone on Snacc by username, ask a friend to settle up, or move it to your bank."
            className="py-0"
          />
          <Button
            size="lg"
            className="h-14 w-full text-base"
            onClick={home.onTopUp}
          >
            Add money to get started
          </Button>
        </div>
      ) : rows.length === 0 ? (
        <EmptyState
          icon={ArrowLeftRightIcon}
          title="Nothing here yet"
          description="Your money moves will show up here."
          className="py-10"
        />
      ) : (
        <>
          <HistoryRows rows={rows} onOpen={home.openDetail} />
          {more ? (
            <button
              type="button"
              onClick={onOpenTransactions}
              className="mx-6 mt-2 flex w-[calc(100%-3rem)] items-center justify-center gap-1.5 py-3 text-sm font-bold text-foreground transition-opacity active:opacity-60"
            >
              See all transactions <ChevronRightIcon className="size-4" />
            </button>
          ) : null}
        </>
      )}

      <TransactionDetailSheet
        open={home.detail.open}
        onOpenChange={home.detail.onOpenChange}
        detail={detail.data ?? null}
        loading={detail.isLoading}
        failed={detail.isError}
        onRetry={() => void detail.refetch()}
        receipt={receipt}
        onSendAgain={(username) => {
          home.detail.onOpenChange(false)
          onSendAgain(username)
        }}
      />

      <RequestDetailSheet
        open={home.request.open}
        onOpenChange={home.request.onOpenChange}
        request={home.request.value}
        box="incoming"
        busy={
          !!home.request.value &&
          home.requestActions.busyId === home.request.value.id
        }
        onPay={home.fromSheet(home.requestActions.pay)}
        onDecline={home.fromSheet(home.requestActions.decline)}
        onCancel={home.fromSheet(home.requestActions.cancel)}
      />
    </>
  )
}

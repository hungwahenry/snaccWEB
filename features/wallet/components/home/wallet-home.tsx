import { ArrowLeftRightIcon, ChevronRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { LoadFailed } from "@/components/ui/load-failed"
import { Spinner } from "@/components/ui/spinner"
import type { WalletHomeProps } from "../../hooks/home/use-wallet-home"
import { WALLET_HOME_COPY } from "../../utils/home-copy"
import { RequestDetailSheet } from "../requests/request-detail-sheet"
import { BalanceCard } from "./balance-card"
import { EarningsLinkCard } from "./earnings-link-card"
import { HistoryRows } from "./history-rows"
import { PendingRequestCard } from "./pending-request-card"
import { RecipientsStrip } from "./recipients-strip"
import { TransactionDetailSheet } from "./transaction-detail-sheet"
import { WalletHomeSkeleton } from "./wallet-home-skeleton"

export function WalletHome({
  loading,
  skeleton,
  failed,
  retry,
  card,
  pending,
  recipients,
  earnings,
  activity,
  transactionSheet,
  requestSheet,
  onSeeAll,
}: WalletHomeProps & { onSeeAll: () => void }) {
  if (loading) return <WalletHomeSkeleton {...skeleton} />
  if (failed || !card) {
    return (
      <div className="py-24">
        <LoadFailed title="Could not load your wallet" onRetry={retry} />
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-6 pt-4 pb-2">
        <BalanceCard {...card} />

        {pending.requests.length > 0 ? (
          <div className="flex flex-col gap-3 px-6">
            {pending.requests.map((request) => (
              <PendingRequestCard
                key={request.id}
                request={request}
                busy={pending.isBusy(request.id)}
                onOpen={pending.onOpen}
                onPay={pending.onPay}
                onDecline={pending.onDecline}
              />
            ))}
          </div>
        ) : null}

        <RecipientsStrip {...recipients} />

        {earnings ? (
          <div className="px-6">
            <EarningsLinkCard line={earnings.line} />
          </div>
        ) : null}

        {activity.firstRun ? null : (
          <p className="px-6 pt-1 text-xs font-bold tracking-wide text-muted-foreground uppercase">
            {WALLET_HOME_COPY.recent}
          </p>
        )}
      </div>

      {activity.loading ? (
        <div className="flex justify-center py-10">
          <Spinner className="text-muted-foreground" />
        </div>
      ) : activity.firstRun ? (
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
            onClick={activity.onTopUp}
          >
            Add money to get started
          </Button>
        </div>
      ) : activity.rows.length === 0 ? (
        <EmptyState
          icon={ArrowLeftRightIcon}
          title="Nothing here yet"
          description="Your money moves will show up here."
          className="py-10"
        />
      ) : (
        <>
          <HistoryRows rows={activity.rows} onOpen={activity.onOpen} />
          {activity.more ? (
            <button
              type="button"
              onClick={onSeeAll}
              className="mx-6 mt-2 flex w-[calc(100%-3rem)] items-center justify-center gap-1.5 py-3 text-sm font-bold text-foreground transition-opacity active:opacity-60"
            >
              See all transactions <ChevronRightIcon className="size-4" />
            </button>
          ) : null}
        </>
      )}

      <TransactionDetailSheet {...transactionSheet} />
      <RequestDetailSheet {...requestSheet} />
    </>
  )
}

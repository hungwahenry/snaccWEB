"use client"

import { SparklesIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { Eyebrow } from "@/components/ui/eyebrow"
import { ListFooter } from "@/components/ui/list-footer"
import { LoadFailed } from "@/components/ui/load-failed"
import { LoadMore } from "@/components/ui/load-more"
import { Spinner } from "@/components/ui/spinner"
import { UserAvatar } from "@/components/ui/user-avatar"
import { useClaimEarnings } from "@/features/wallet/hooks/account/use-claim-earnings"
import { useWalletOverview } from "@/features/wallet/hooks/account/use-wallet-overview"
import { formatNaira, shortDate } from "@/lib/format"
import type { EarningEvent } from "../api"
import {
  useCampusFund,
  useEarningEvents,
  useTopSnaccs,
} from "../hooks/use-earnings"
import { EarningsSkeleton } from "./earnings-skeleton"
import { FundBar } from "./fund-bar"
import { MilestoneList } from "./milestone-list"

const VERBS: Record<EarningEvent["type"], string> = {
  reaction: "reacted",
  resnacc: "resnacced",
  bonus: "earned a bonus",
}

export function MonetisationHome() {
  const overview = useWalletOverview()
  const fund = useCampusFund()
  const events = useEarningEvents()
  const topSnaccs = useTopSnaccs()
  const claim = useClaimEarnings()

  if (overview.isLoading || fund.isLoading || topSnaccs.isLoading)
    return <EarningsSkeleton />
  if (overview.isError || !overview.data) {
    return (
      <div className="py-24">
        <LoadFailed
          title="Could not load your earnings"
          onRetry={() => void overview.refetch()}
        />
      </div>
    )
  }

  const earnings = overview.data.earnings

  return (
    <div className="pb-8">
      <div className="flex flex-col gap-6 px-6 pt-8 pb-3">
        <div className="flex flex-col items-center gap-1.5">
          <Eyebrow>Earnings</Eyebrow>
          <p className="truncate text-center text-6xl font-extrabold text-foreground tabular-nums">
            {formatNaira(earnings.balance)}
          </p>
          <p className="text-center text-sm text-muted-foreground">
            From reactions and resnaccs on your snaccs.
          </p>
        </div>

        {earnings.claimable ? (
          <Button
            size="lg"
            className="h-14 text-base"
            disabled={claim.isPending}
            onClick={() => claim.mutate()}
          >
            {claim.isPending ? (
              <Spinner />
            ) : (
              <>
                <SparklesIcon /> Claim {formatNaira(earnings.balance)}
              </>
            )}
          </Button>
        ) : (
          <MilestoneList milestones={earnings.milestones} />
        )}

        {fund.data ? <FundBar fund={fund.data} /> : null}

        {topSnaccs.data && topSnaccs.data.length > 0 ? (
          <div className="flex flex-col gap-3">
            <Eyebrow>Top earning snaccs</Eyebrow>
            {topSnaccs.data.slice(0, 3).map((row, index) => (
              <div key={row.snacc.id} className="flex items-center gap-3">
                <span className="w-5 text-lg font-extrabold text-muted-foreground">
                  {index + 1}
                </span>
                <span className="flex-1 truncate text-sm text-foreground">
                  {row.snacc.body ?? "A snacc"}
                </span>
                <span className="text-sm font-extrabold text-foreground tabular-nums">
                  {formatNaira(row.total)}
                </span>
              </div>
            ))}
          </div>
        ) : null}

        <Eyebrow>Recent</Eyebrow>
      </div>

      {events.loading ? (
        <div className="flex justify-center py-10">
          <Spinner className="text-muted-foreground" />
        </div>
      ) : events.items.length === 0 ? (
        <EmptyState
          icon={SparklesIcon}
          title="No earnings yet"
          description="Post snaccs people love — every reaction pays."
          className="py-10"
        />
      ) : (
        events.items.map((item) => (
          <div key={item.id} className="flex items-center gap-3 px-6 py-2.5">
            <UserAvatar
              alt={item.actor.display_name ?? "User"}
              className="size-9"
              avatarUrl={item.actor.avatar_url}
              name={item.actor.username}
            />
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-sm text-foreground">
                <span className="font-bold">@{item.actor.username}</span>{" "}
                {VERBS[item.type]}
              </span>
              <span className="text-xs text-muted-foreground">
                {shortDate(item.created_at)}
              </span>
            </span>
            <span className="text-sm font-extrabold text-foreground tabular-nums">
              +{formatNaira(item.amount)}
            </span>
          </div>
        ))
      )}
      <LoadMore
        onReach={events.loadMore}
        disabled={events.loading || events.loadingMore}
      />
      <ListFooter loading={events.loadingMore} />
    </div>
  )
}

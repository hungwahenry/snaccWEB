"use client"

import { CalendarHeartIcon, CalendarXIcon, PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { IconButton } from "@/components/ui/icon-button"
import { ListFooter } from "@/components/ui/list-footer"
import { LoadFailed } from "@/components/ui/load-failed"
import { LoadMore } from "@/components/ui/load-more"
import { PillTabs } from "@/components/ui/pill-tabs"
import { SkeletonRows } from "@/components/ui/skeleton-rows"
import { BackHeader } from "@/features/navigation/components/back-header"
import { HangoutCard } from "../components/lists/hangout-card"
import { HangoutCardSkeleton } from "../components/lists/hangout-card-skeleton"
import { useHangoutsScreen } from "../hooks/lists/use-hangouts-screen"
import { HANGOUT_EMPTY, HANGOUT_TABS } from "../utils/tabs"

export function HangoutsScreen() {
  const { onBack, enabled, scope, setScope, list, plan } = useHangoutsScreen()
  const empty = HANGOUT_EMPTY[scope]

  if (enabled === false) {
    return (
      <>
        <BackHeader title="Hangouts" onBack={onBack} />
        <EmptyState
          icon={CalendarXIcon}
          title="Not available"
          description="Hangouts are switched off right now."
          className="py-24"
        />
      </>
    )
  }

  return (
    <>
      <BackHeader
        title="Hangouts"
        onBack={onBack}
        right={
          plan ? (
            <IconButton icon={PlusIcon} label="Plan a hangout" onClick={plan} />
          ) : undefined
        }
      />
      <PillTabs tabs={HANGOUT_TABS} value={scope} onChange={setScope} />

      {list.failed && list.cards.length === 0 ? (
        <div className="py-24">
          <LoadFailed title="Could not load hangouts" onRetry={list.retry} />
        </div>
      ) : list.loading ? (
        <SkeletonRows count={4} item={HangoutCardSkeleton} />
      ) : list.cards.length === 0 ? (
        <EmptyState
          icon={CalendarHeartIcon}
          title={empty.title}
          description={empty.description}
          className="py-24"
          action={
            plan ? (
              <Button size="sm" onClick={plan}>
                Plan one
              </Button>
            ) : undefined
          }
        />
      ) : (
        <>
          {list.cards.map((card) => (
            <HangoutCard key={card.id} card={card} />
          ))}
          <LoadMore onReach={list.loadMore} disabled={list.loadingMore} />
          <ListFooter loading={list.loadingMore} />
        </>
      )}
    </>
  )
}

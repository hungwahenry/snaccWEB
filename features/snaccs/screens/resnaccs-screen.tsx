"use client"

import { QuoteIcon, RepeatIcon } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import { ListFooter } from "@/components/ui/list-footer"
import { LoadFailed } from "@/components/ui/load-failed"
import { LoadMore } from "@/components/ui/load-more"
import { PillTabs } from "@/components/ui/pill-tabs"
import { SkeletonRows } from "@/components/ui/skeleton-rows"
import { BackHeader } from "@/features/navigation/components/back-header"
import { useSnaccTracker } from "@/features/snaccs/hooks/use-snacc-tracker"
import { useBack } from "@/hooks/use-back"
import { ResnaccerRow } from "../components/resnaccs/resnaccer-row"
import { ResnaccerRowSkeleton } from "../components/resnaccs/resnaccer-row-skeleton"
import { SnaccSheets } from "../components/sheets/snacc-sheets"
import { SnaccList } from "../components/snacc-list"
import { useResnaccLists } from "../hooks/resnaccs/use-resnacc-lists"
import { useSnaccActions } from "../hooks/use-snacc-actions"

export function ResnaccsScreen({ id }: { id: string }) {
  const back = useBack()
  const screen = useResnaccLists(id)
  const { handlers, votingPollFor, sheets } = useSnaccActions()
  const tracker = useSnaccTracker()

  return (
    <>
      <BackHeader title="Resnaccs" onBack={back} />
      <PillTabs
        tabs={screen.tabs}
        value={screen.tab}
        onChange={screen.onTabChange}
      />

      {screen.tab === "quotes" ? (
        <SnaccList
          snaccs={screen.quotes.items}
          loading={screen.quotes.loading}
          failed={screen.quotes.failed}
          loadingMore={screen.quotes.loadingMore}
          onRetry={screen.quotes.retry}
          onLoadMore={screen.quotes.loadMore}
          handlers={handlers}
          votingPollFor={votingPollFor}
          itemRef={tracker.ref}
          failedTitle="Could not load quotes"
          empty={{
            icon: QuoteIcon,
            title: "No quotes yet",
            description: "Nobody has added their own take.",
          }}
          skeletonCount={4}
        />
      ) : screen.people.failed && screen.people.items.length === 0 ? (
        <LoadFailed
          title="Could not load this list"
          onRetry={screen.people.retry}
        />
      ) : screen.people.loading ? (
        <SkeletonRows count={8} item={ResnaccerRowSkeleton} />
      ) : screen.people.items.length === 0 ? (
        <EmptyState
          icon={RepeatIcon}
          title="No resnaccs yet"
          description="Nobody has passed this on."
          className="py-24"
        />
      ) : (
        <>
          {screen.people.items.map((resnaccer) => (
            <ResnaccerRow key={resnaccer.user.id} resnaccer={resnaccer} />
          ))}
          <LoadMore
            onReach={screen.people.loadMore}
            disabled={screen.people.loadingMore}
          />
          <ListFooter loading={screen.people.loadingMore} />
        </>
      )}

      <SnaccSheets {...sheets} />
    </>
  )
}

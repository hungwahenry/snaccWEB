"use client"

import { CompassIcon } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import { MatchDetailSheet } from "@/features/football/components/match-detail-sheet"
import { Matchday } from "@/features/football/components/matchday"
import { MatchdaySkeleton } from "@/features/football/components/matchday-skeleton"
import { HangoutsStrip } from "@/features/hangouts/components/lists/hangouts-strip"
import {
  SnaccCard,
  type SnaccActionHandlers,
} from "@/features/snaccs/components/card/snacc-card"
import type { PollVote } from "@/features/snaccs/types"
import { DiscoverSections } from "../components/discover-sections"
import { useDiscover } from "../hooks/use-discover"

export function Discover({
  handlers,
  votingPollFor,
}: {
  handlers: SnaccActionHandlers
  votingPollFor: PollVote | null
}) {
  const discover = useDiscover()
  const { matchday, promotion } = discover

  return (
    <div className="flex flex-col gap-6 px-4 py-4 [--gutter:16px]">
      {matchday.loading ? (
        <MatchdaySkeleton />
      ) : (
        <Matchday
          matches={matchday.matches}
          counts={matchday.counts}
          onPressMatch={matchday.onPressMatch}
        />
      )}
      {discover.hangouts.show ? (
        <HangoutsStrip
          cards={discover.hangouts.cards}
          now={discover.hangouts.now}
          seeAllHref={discover.hangouts.seeAllHref}
          onOpen={discover.hangouts.onOpen}
          onPlan={discover.hangouts.onPlan}
          className="-mx-(--gutter)"
        />
      ) : null}
      {promotion ? (
        <div className="-mx-(--gutter) border-t border-border">
          <SnaccCard
            snacc={promotion.snacc}
            votingPollFor={votingPollFor}
            itemRef={promotion.itemRef}
            onOpenPromotionLink={promotion.onOpenPromotionLink}
            {...handlers}
          />
        </div>
      ) : null}
      <DiscoverSections
        celebrants={discover.celebrants}
        suggestions={discover.suggestions}
        tags={discover.tags}
      />
      {discover.quiet ? (
        <EmptyState
          icon={CompassIcon}
          title="Find your people"
          description="Search for people, snaccs, and tags across every campus."
          className="py-10"
        />
      ) : null}

      <MatchDetailSheet {...discover.matchSheet} />
    </div>
  )
}

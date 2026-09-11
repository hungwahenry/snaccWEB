"use client"

import { CompassIcon } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import { MatchDetailSheet } from "@/features/football/components/match-detail-sheet"
import { Matchday } from "@/features/football/components/matchday"
import { MatchdaySkeleton } from "@/features/football/components/matchday-skeleton"
import { DiscoverSections } from "../components/discover-sections"
import { useDiscover } from "../hooks/use-discover"

export function Discover() {
  const discover = useDiscover()
  const { matchday } = discover

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
      <DiscoverSections
        ghost={discover.ghost}
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

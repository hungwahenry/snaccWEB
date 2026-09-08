"use client"

import { CompassIcon } from "lucide-react"
import { useState } from "react"
import { EmptyState } from "@/components/ui/empty-state"
import { BirthdaysToday } from "@/features/birthdays/components/birthdays-today"
import { useCampusBirthdays } from "@/features/birthdays/hooks/use-campus-birthdays"
import { MatchDetailSheet } from "@/features/football/components/match-detail-sheet"
import { Matchday } from "@/features/football/components/matchday"
import { MatchdaySkeleton } from "@/features/football/components/matchday-skeleton"
import { useMatchDetail } from "@/features/football/hooks/use-match-detail"
import { useScoreboard } from "@/features/football/hooks/use-scoreboard"
import {
  FollowSuggestions,
  FollowSuggestionsSkeleton,
} from "@/features/follows/components/follow-suggestions"
import { useFollowSuggestions } from "@/features/follows/hooks/use-follow-suggestions"
import { GhostHourCard } from "@/features/ghost/components/ghost-hour-card"
import { useGhostHourCard } from "@/features/ghost/hooks/use-ghost-hour-card"
import { usePopularHashtags } from "@/features/hashtags/hooks/use-popular-hashtags"
import { TrendingTags, TrendingTagsSkeleton } from "../components/trending-tags"

export function Discover({ compact = false }: { compact?: boolean }) {
  const ghost = useGhostHourCard()
  const scoreboard = useScoreboard()
  const birthdays = useCampusBirthdays()
  const hashtags = usePopularHashtags()
  const suggestions = useFollowSuggestions()
  const [matchId, setMatchId] = useState<string | null>(null)
  const match = useMatchDetail(matchId)

  const matches = scoreboard.data?.matches ?? []
  const tags = hashtags.data ?? []
  const quiet =
    !scoreboard.isLoading &&
    !hashtags.isLoading &&
    !suggestions.loading &&
    matches.length === 0 &&
    tags.length === 0 &&
    suggestions.users.length === 0

  return (
    <div
      className={
        compact
          ? "flex flex-col gap-5 [--gutter:24px]"
          : "flex flex-col gap-6 px-4 py-4 [--gutter:16px]"
      }
    >
      {ghost.visible ? (
        <GhostHourCard active={ghost.active} subtitle={ghost.subtitle} />
      ) : null}
      {compact ? null : scoreboard.isLoading ? (
        <MatchdaySkeleton />
      ) : (
        <Matchday
          matches={matches}
          onPressMatch={(entry) => setMatchId(entry.id)}
        />
      )}
      <BirthdaysToday celebrants={birthdays.data ?? []} />
      {suggestions.loading ? (
        <FollowSuggestionsSkeleton />
      ) : (
        <FollowSuggestions
          users={suggestions.users}
          onToggleFollow={suggestions.onToggleFollow}
        />
      )}
      {hashtags.isLoading ? (
        <TrendingTagsSkeleton />
      ) : (
        <TrendingTags tags={tags} />
      )}
      {quiet && !compact ? (
        <EmptyState
          icon={CompassIcon}
          title="Find your people"
          description="Search for people, snaccs, and tags across every campus."
          className="py-10"
        />
      ) : null}

      {compact ? null : (
        <MatchDetailSheet
          open={matchId !== null}
          onOpenChange={(open) => !open && setMatchId(null)}
          detail={match.data ?? null}
          loading={match.isLoading}
          failed={match.isError}
        />
      )}
    </div>
  )
}

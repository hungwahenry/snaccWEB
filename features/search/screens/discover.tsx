"use client"

import { CompassIcon } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import {
  FollowSuggestions,
  FollowSuggestionsSkeleton,
} from "@/features/follows/components/follow-suggestions"
import { useFollowSuggestions } from "@/features/follows/hooks/use-follow-suggestions"
import { GhostHourCard } from "@/features/ghost/components/ghost-hour-card"
import { useGhostHourCard } from "@/features/ghost/hooks/use-ghost-hour-card"
import { usePopularHashtags } from "@/features/hashtags/hooks/use-popular-hashtags"
import { TrendingTags, TrendingTagsSkeleton } from "../components/trending-tags"

/// What the search page shows before a query: what's trending and who to follow.
export function Discover({ compact = false }: { compact?: boolean }) {
  const ghost = useGhostHourCard()
  const hashtags = usePopularHashtags()
  const suggestions = useFollowSuggestions()

  const tags = hashtags.data ?? []
  const quiet =
    !hashtags.isLoading &&
    !suggestions.loading &&
    tags.length === 0 &&
    suggestions.users.length === 0

  return (
    <div
      className={
        compact ? "flex flex-col gap-5" : "flex flex-col gap-6 px-4 py-4"
      }
    >
      {ghost.visible ? (
        <GhostHourCard active={ghost.active} subtitle={ghost.subtitle} />
      ) : null}
      {hashtags.isLoading ? (
        <TrendingTagsSkeleton />
      ) : (
        <TrendingTags tags={tags} />
      )}
      {suggestions.loading ? (
        <FollowSuggestionsSkeleton />
      ) : (
        <FollowSuggestions
          users={suggestions.users}
          onToggleFollow={suggestions.onToggleFollow}
        />
      )}
      {quiet && !compact ? (
        <EmptyState
          icon={CompassIcon}
          title="Find your people"
          description="Search for people, snaccs, and tags across every campus."
          className="py-10"
        />
      ) : null}
    </div>
  )
}

import { BirthdaysToday } from "@/features/birthdays/components/birthdays-today"
import { FollowSuggestions } from "@/features/follows/components/follow-suggestions"
import { FollowSuggestionsSkeleton } from "@/features/follows/components/follow-suggestions-skeleton"
import type { FollowUser } from "@/features/follows/types"
import { GhostHourCard } from "@/features/ghost/components/ghost-hour-card"
import { TrendingTags } from "@/features/hashtags/components/trending-tags"
import { TrendingTagsSkeleton } from "@/features/hashtags/components/trending-tags-skeleton"
import type { Hashtag } from "@/features/hashtags/types"

export type DiscoverSectionsProps = {
  ghost: { visible: boolean; active: boolean; subtitle: string }
  celebrants: FollowUser[]
  suggestions: {
    loading: boolean
    users: FollowUser[]
    onToggleFollow: (user: FollowUser) => void
  }
  tags: { loading: boolean; tags: Hashtag[] }
}

/** Ghost Hour, today's birthdays, people to follow and trending tags. */
export function DiscoverSections({
  ghost,
  celebrants,
  suggestions,
  tags,
}: DiscoverSectionsProps) {
  return (
    <>
      {ghost.visible ? (
        <GhostHourCard active={ghost.active} subtitle={ghost.subtitle} />
      ) : null}
      <BirthdaysToday celebrants={celebrants} />
      {suggestions.loading ? (
        <FollowSuggestionsSkeleton />
      ) : (
        <FollowSuggestions
          users={suggestions.users}
          onToggleFollow={suggestions.onToggleFollow}
        />
      )}
      {tags.loading ? (
        <TrendingTagsSkeleton />
      ) : (
        <TrendingTags tags={tags.tags} />
      )}
    </>
  )
}

"use client"

import { useCampusBirthdays } from "@/features/birthdays/hooks/use-campus-birthdays"
import { useFollowSuggestions } from "@/features/follows/hooks/use-follow-suggestions"
import { useGhostHourCard } from "@/features/ghost/hooks/use-ghost-hour-card"
import { usePopularHashtags } from "@/features/hashtags/hooks/use-popular-hashtags"

/** The parts of Discover that also ride along the side of every page on wide screens. */
export function useDiscoverRail() {
  const ghost = useGhostHourCard()
  const birthdays = useCampusBirthdays()
  const suggestions = useFollowSuggestions()
  const hashtags = usePopularHashtags()

  return {
    ghost,
    celebrants: birthdays.data ?? [],
    suggestions: {
      loading: suggestions.loading,
      users: suggestions.users,
      onToggleFollow: suggestions.onToggleFollow,
    },
    tags: {
      loading: hashtags.isLoading,
      tags: hashtags.data ?? [],
    },
  }
}

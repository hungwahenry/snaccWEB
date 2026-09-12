"use client"

import { useFlag } from "@/features/config/hooks/use-flag"
import { MatchdaySkeleton } from "@/features/football/components/matchday-skeleton"
import { FollowSuggestionsSkeleton } from "@/features/follows/components/follow-suggestions-skeleton"
import { TrendingTagsSkeleton } from "@/features/hashtags/components/trending-tags-skeleton"
import { SearchHeader } from "@/features/search/components/search-header"
import { useBack } from "@/hooks/use-back"

const ignore = () => {}

export default function Loading() {
  const back = useBack()
  const liveScores = useFlag("live_scores")

  return (
    <>
      <SearchHeader value="" onChange={ignore} onBack={back} />
      <div className="flex flex-col gap-6 px-4 py-4 [--gutter:16px]">
        {liveScores ? <MatchdaySkeleton /> : null}
        <FollowSuggestionsSkeleton />
        <TrendingTagsSkeleton />
      </div>
    </>
  )
}

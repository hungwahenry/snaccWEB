"use client"

import { PillTabs } from "@/components/ui/pill-tabs"
import {
  CampusRow,
  CampusRowSkeleton,
} from "@/features/campus/components/campus-row"
import {
  FollowUserRow,
  FollowUserRowSkeleton,
} from "@/features/follows/components/follow-user-row"
import {
  HashtagRow,
  HashtagRowSkeleton,
} from "@/features/hashtags/components/hashtag-row"
import { SnaccSheets } from "@/features/snaccs/components/sheets/snacc-sheets"
import { SnaccList } from "@/features/snaccs/components/snacc-list"
import { useSnaccActions } from "@/features/snaccs/hooks/use-snacc-actions"
import { useViewTracker } from "@/features/views/hooks/use-view-tracker"
import { useBack } from "@/hooks/use-back"
import { SearchHeader } from "../components/search-header"
import { SearchResults } from "../components/search-results"
import { useSearchScreen } from "../hooks/use-search-screen"
import { SEARCH_EMPTY, SEARCH_FAILED, SEARCH_TAB_PILLS } from "../utils/tabs"
import { Discover } from "./discover"

export function SearchScreen() {
  const back = useBack()
  const search = useSearchScreen()
  const { handlers, votingPollFor, sheets } = useSnaccActions()
  const tracker = useViewTracker()
  const { people, snaccs, tags, campuses, settling } = search

  return (
    <>
      <SearchHeader
        value={search.query}
        onChange={search.setQuery}
        onBack={back}
      />

      {search.idle ? (
        <Discover />
      ) : (
        <>
          <PillTabs
            tabs={SEARCH_TAB_PILLS}
            value={search.tab}
            onChange={search.setTab}
          />

          {search.tab === "people" ? (
            <SearchResults
              items={people.users}
              loading={settling || people.loading}
              failed={people.failed}
              loadingMore={people.loadingMore}
              onRetry={people.retry}
              onLoadMore={people.loadMore}
              skeleton={FollowUserRowSkeleton}
              failedTitle={SEARCH_FAILED}
              empty={SEARCH_EMPTY.people}
              renderItem={(user) => (
                <FollowUserRow
                  key={user.id}
                  user={user}
                  isMe={user.id === search.meId}
                  onToggleFollow={() => people.onToggleFollow(user)}
                />
              )}
            />
          ) : search.tab === "snaccs" ? (
            <SnaccList
              snaccs={snaccs.snaccs}
              loading={settling || snaccs.loading}
              failed={snaccs.failed}
              loadingMore={snaccs.loadingMore}
              onRetry={snaccs.retry}
              onLoadMore={snaccs.loadMore}
              handlers={handlers}
              votingPollFor={votingPollFor}
              itemRef={tracker.ref}
              failedTitle={SEARCH_FAILED}
              empty={SEARCH_EMPTY.snaccs}
            />
          ) : search.tab === "tags" ? (
            <SearchResults
              items={tags.hashtags}
              loading={settling || tags.loading}
              failed={tags.failed}
              loadingMore={tags.loadingMore}
              onRetry={tags.retry}
              onLoadMore={tags.loadMore}
              skeleton={HashtagRowSkeleton}
              failedTitle={SEARCH_FAILED}
              empty={SEARCH_EMPTY.tags}
              renderItem={(hashtag) => (
                <HashtagRow key={hashtag.tag} hashtag={hashtag} />
              )}
            />
          ) : (
            <SearchResults
              items={campuses.campuses}
              loading={settling || campuses.loading}
              failed={campuses.failed}
              loadingMore={campuses.loadingMore}
              onRetry={campuses.retry}
              onLoadMore={campuses.loadMore}
              skeleton={CampusRowSkeleton}
              failedTitle={SEARCH_FAILED}
              empty={SEARCH_EMPTY.campuses}
              renderItem={(university) => (
                <CampusRow key={university.id} university={university} />
              )}
            />
          )}
        </>
      )}

      <SnaccSheets {...sheets} />
    </>
  )
}

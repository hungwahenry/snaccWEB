"use client"

import {
  GraduationCapIcon,
  HashIcon,
  MessageSquareDashedIcon,
  MessageSquareIcon,
  UsersRoundIcon,
} from "lucide-react"
import { useState } from "react"
import { ListFooter } from "@/components/ui/list-footer"
import { LoadMore } from "@/components/ui/load-more"
import { PillTabs, type PillTab } from "@/components/ui/pill-tabs"
import { SkeletonRows } from "@/components/ui/skeleton-rows"
import { useMe } from "@/features/auth/hooks/use-me"
import {
  FollowUserRow,
  FollowUserRowSkeleton,
} from "@/features/follows/components/follow-user-row"
import { SnaccSheets } from "@/features/snaccs/components/sheets/snacc-sheets"
import { SnaccList } from "@/features/snaccs/components/snacc-list"
import { useSnaccActions } from "@/features/snaccs/hooks/use-snacc-actions"
import { useUniversities } from "@/features/universities/hooks/use-universities"
import { useViewTracker } from "@/features/views/hooks/use-view-tracker"
import { useBack } from "@/hooks/use-back"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { CampusRow } from "../components/campus-row"
import { HashtagRow, HashtagRowSkeleton } from "../components/hashtag-row"
import { SearchHeader } from "../components/search-header"
import { SearchEmpty } from "../components/search-states"
import {
  useSearchHashtags,
  useSearchSnaccs,
  useSearchUsers,
} from "../hooks/use-search"
import type { SearchTab } from "../types"
import { Discover } from "./discover"

const TABS: PillTab<SearchTab>[] = [
  { value: "people", label: "People", icon: UsersRoundIcon },
  { value: "snaccs", label: "Snaccs", icon: MessageSquareIcon },
  { value: "tags", label: "Tags", icon: HashIcon },
  { value: "campuses", label: "Campuses", icon: GraduationCapIcon },
]

export function SearchScreen() {
  const back = useBack()
  const [query, setQuery] = useState("")
  const [tab, setTab] = useState<SearchTab>("people")
  const debounced = useDebouncedValue(query.trim(), 300)

  return (
    <>
      <SearchHeader value={query} onChange={setQuery} onBack={back} />

      {debounced.length === 0 ? (
        <Discover />
      ) : (
        <>
          <PillTabs tabs={TABS} value={tab} onChange={setTab} />
          {tab === "people" ? (
            <PeopleResults query={debounced} />
          ) : tab === "snaccs" ? (
            <SnaccResults query={debounced} />
          ) : tab === "tags" ? (
            <TagResults query={debounced} />
          ) : (
            <CampusResults query={debounced} />
          )}
        </>
      )}
    </>
  )
}

function PeopleResults({ query }: { query: string }) {
  const list = useSearchUsers(query)
  const me = useMe()

  if (list.users.length === 0) {
    return (
      <SearchEmpty
        loading={list.loading}
        failed={list.failed}
        onRetry={list.retry}
        icon={UsersRoundIcon}
        title="No people found"
        description="Try a name or a username."
        skeleton={<SkeletonRows count={8} item={FollowUserRowSkeleton} />}
      />
    )
  }

  return (
    <>
      {list.users.map((user) => (
        <FollowUserRow
          key={user.id}
          user={user}
          isMe={me.data?.id === user.id}
          onToggleFollow={() => list.onToggleFollow(user)}
        />
      ))}
      <LoadMore onReach={list.loadMore} disabled={list.loadingMore} />
      <ListFooter loading={list.loadingMore} />
    </>
  )
}

function SnaccResults({ query }: { query: string }) {
  const list = useSearchSnaccs(query)
  const { handlers, votingPollFor, sheets } = useSnaccActions()
  const tracker = useViewTracker()

  return (
    <>
      <SnaccList
        snaccs={list.snaccs}
        loading={list.loading}
        failed={list.failed}
        loadingMore={list.loadingMore}
        onRetry={list.retry}
        onLoadMore={list.loadMore}
        handlers={handlers}
        votingPollFor={votingPollFor}
        itemRef={tracker.ref}
        failedTitle="Something went wrong"
        empty={{
          icon: MessageSquareDashedIcon,
          title: "No snaccs found",
          description: "Try different words.",
        }}
      />
      <SnaccSheets {...sheets} />
    </>
  )
}

function TagResults({ query }: { query: string }) {
  const list = useSearchHashtags(query)

  if (list.hashtags.length === 0) {
    return (
      <SearchEmpty
        loading={list.loading}
        failed={list.failed}
        onRetry={list.retry}
        icon={HashIcon}
        title="No tags found"
        description="Try another tag."
        skeleton={<SkeletonRows count={8} item={HashtagRowSkeleton} />}
      />
    )
  }

  return (
    <>
      {list.hashtags.map((hashtag) => (
        <HashtagRow key={hashtag.tag} hashtag={hashtag} />
      ))}
      <LoadMore onReach={list.loadMore} disabled={list.loadingMore} />
      <ListFooter loading={list.loadingMore} />
    </>
  )
}

function CampusResults({ query }: { query: string }) {
  const universities = useUniversities(query)
  const items = universities.data?.items ?? []

  if (items.length === 0) {
    return (
      <SearchEmpty
        loading={universities.isLoading}
        failed={universities.isError}
        onRetry={() => void universities.refetch()}
        icon={GraduationCapIcon}
        title="No campuses found"
        description="Try the full name or the acronym."
      />
    )
  }

  return (
    <>
      {items.map((university) => (
        <CampusRow key={university.id} university={university} />
      ))}
    </>
  )
}

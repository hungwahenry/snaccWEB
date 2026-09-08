"use client"

import {
  CompassIcon,
  MessageSquareDashedIcon,
  UsersRoundIcon,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { IconButton } from "@/components/ui/icon-button"
import { useFlag } from "@/features/config/hooks/use-flag"
import { AppHeader } from "@/features/navigation/components/app-header"
import { SnaccSheets } from "@/features/snaccs/components/sheets/snacc-sheets"
import { SnaccList } from "@/features/snaccs/components/snacc-list"
import { useSnaccActions } from "@/features/snaccs/hooks/use-snacc-actions"
import { useViewTracker } from "@/features/views/hooks/use-view-tracker"
import { FeedSortSheet } from "../components/feed-sort-sheet"
import { FeedTabs } from "../components/feed-tabs"
import { NewSnaccsPill } from "../components/new-snaccs-pill"
import { useFeedScreen } from "../hooks/use-feed-screen"
import type { FeedScope } from "../types"

const EMPTY: Record<FeedScope, { title: string; description: string }> = {
  campus: {
    title: "No snaccs yet",
    description: "Nothing has been posted on your campus. Be the first.",
  },
  global: {
    title: "Nothing going on",
    description: "No campus has posted anything worth passing on yet.",
  },
  following: {
    title: "You follow nobody yet",
    description:
      "Follow a few people and their snaccs land here, newest first.",
  },
}

export function HomeScreen() {
  const screen = useFeedScreen()
  const { handlers, votingPollFor, sheets } = useSnaccActions()
  const tracker = useViewTracker()
  const searchEnabled = useFlag("search")

  const empty = EMPTY[screen.scope]

  return (
    <>
      <AppHeader
        left={
          searchEnabled ? (
            <Link href="/search" aria-label="Explore">
              <IconButton icon={CompassIcon} label="Explore" />
            </Link>
          ) : undefined
        }
      />

      <div className="sticky top-14 z-20 bg-background/90 backdrop-blur md:top-0">
        <FeedTabs
          value={screen.scope}
          onChange={screen.pickScope}
          onReselect={screen.sortable ? screen.openSortMenu : undefined}
          following={screen.tabs.following}
          global={screen.tabs.global}
        />
      </div>

      {screen.hasNew ? (
        <NewSnaccsPill posters={screen.newPosters} onPress={screen.refresh} />
      ) : null}

      <SnaccList
        snaccs={screen.feed.snaccs}
        loading={screen.feed.loading || screen.feed.stale}
        failed={screen.feed.failed}
        loadingMore={screen.feed.loadingMore}
        onRetry={screen.feed.retry}
        onLoadMore={screen.feed.loadMore}
        handlers={handlers}
        votingPollFor={votingPollFor}
        itemRef={tracker.ref}
        failedTitle={
          screen.scope === "campus"
            ? "Could not load your campus"
            : "Could not load the feed"
        }
        empty={{
          icon:
            screen.scope === "following"
              ? UsersRoundIcon
              : MessageSquareDashedIcon,
          title: empty.title,
          description: empty.description,
          action:
            screen.scope === "following" && searchEnabled ? (
              <Button variant="secondary" render={<Link href="/search" />}>
                <UsersRoundIcon /> Find people
              </Button>
            ) : undefined,
        }}
      />

      <FeedSortSheet
        open={screen.sortMenuOpen}
        onOpenChange={screen.setSortMenuOpen}
        value={screen.sort}
        onSelect={screen.pickSort}
      />
      <SnaccSheets {...sheets} />
    </>
  )
}

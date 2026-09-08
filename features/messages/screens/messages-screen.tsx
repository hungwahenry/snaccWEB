"use client"

import { GhostIcon, SearchXIcon } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { IconButton } from "@/components/ui/icon-button"
import { ListFooter } from "@/components/ui/list-footer"
import { LoadFailed } from "@/components/ui/load-failed"
import { LoadMore } from "@/components/ui/load-more"
import { SkeletonRows } from "@/components/ui/skeleton-rows"
import { useMe } from "@/features/auth/hooks/use-me"
import { useFlag } from "@/features/config/hooks/use-flag"
import { TabHeader } from "@/features/navigation/components/tab-header"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { cn } from "@/lib/utils"
import {
  ConversationRow,
  ConversationRowSkeleton,
} from "../components/conversations/conversation-row"
import { ConversationSearch } from "../components/conversations/conversation-search"
import { MessageHitRow } from "../components/conversations/message-hit-row"
import { ShareAnonLinkSheet } from "../components/conversations/share-anon-link-sheet"
import { StreakIntroSheet } from "../components/conversations/streak-intro-sheet"
import { useAnonLink } from "../hooks/use-anon-link"
import { useConversations } from "../hooks/use-conversations"
import { MIN_QUERY, useMessageSearch } from "../hooks/use-message-search"
import { useStreakIntro } from "../hooks/use-streak-intro"

export function MessagesScreen() {
  const [query, setQuery] = useState("")
  const search = useDebouncedValue(query.trim(), 300)
  const searching = search.length >= MIN_QUERY

  const messagesEnabled = useFlag("anon_messages")
  const feed = useConversations(searching ? search : "")
  const hits = useMessageSearch(messagesEnabled ? search : "")
  const me = useMe()
  const streakIntro = useStreakIntro()
  const username = me.data?.profile?.username ?? null
  const showShare = Boolean(
    messagesEnabled &&
    (me.data?.profile?.allow_anonymous_messages ?? false) &&
    username
  )
  const anonLink = useAnonLink(showShare, username)

  const matches = searching ? (hits.data?.items ?? []) : []
  const nothing =
    searching && feed.conversations.length === 0 && matches.length === 0

  return (
    <>
      <TabHeader
        title="DMs"
        right={
          showShare ? (
            <IconButton
              icon={GhostIcon}
              label="Get anonymous messages"
              onClick={anonLink.onOpen}
              className={cn(anonLink.nudge && "motion-safe:animate-pulse")}
            />
          ) : null
        }
      />

      {!messagesEnabled ? (
        <EmptyState
          icon={GhostIcon}
          title="Messages aren't on yet"
          description="Direct messages are switched off right now. They'll show up here once they're turned on."
          className="py-24"
        />
      ) : (
        <>
          <ConversationSearch value={query} onChange={setQuery} />

          {feed.loading ? (
            <SkeletonRows count={8} item={ConversationRowSkeleton} />
          ) : feed.failed && feed.conversations.length === 0 ? (
            <div className="py-24">
              <LoadFailed
                title="Could not load your messages"
                onRetry={feed.retry}
              />
            </div>
          ) : (
            <>
              {feed.conversations.map((conversation) => (
                <ConversationRow
                  key={conversation.id}
                  conversation={conversation}
                />
              ))}

              {feed.conversations.length === 0 && !searching ? (
                <EmptyState
                  icon={GhostIcon}
                  title="No messages yet"
                  description={
                    showShare
                      ? "Start a chat from someone’s profile, or share your link for anonymous messages."
                      : "Start a chat from someone’s profile."
                  }
                  className="py-24"
                  action={
                    showShare ? (
                      <Button size="sm" onClick={anonLink.onOpen}>
                        <GhostIcon /> Share your link
                      </Button>
                    ) : undefined
                  }
                />
              ) : null}

              {matches.length > 0 ? (
                <div className="pt-2">
                  <p className="px-4 pb-1 text-xs font-bold tracking-wide text-muted-foreground uppercase sm:px-6">
                    Messages
                  </p>
                  {matches.map((hit) => (
                    <MessageHitRow key={hit.message.id} hit={hit} />
                  ))}
                </div>
              ) : null}

              {nothing && !hits.isPending ? (
                <EmptyState
                  icon={SearchXIcon}
                  title="Nothing found"
                  description="No person or message matches that."
                  className="py-24"
                />
              ) : null}

              <LoadMore onReach={feed.loadMore} disabled={feed.loadingMore} />
              <ListFooter
                loading={feed.loadingMore || (searching && hits.isPending)}
              />
            </>
          )}
        </>
      )}

      {showShare ? <ShareAnonLinkSheet {...anonLink.sheet} /> : null}
      <StreakIntroSheet {...streakIntro.sheet} />
    </>
  )
}

"use client"

import {
  GhostIcon,
  MessageCircleIcon,
  MessagesSquareIcon,
  SearchXIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { IconButton } from "@/components/ui/icon-button"
import { ListFooter } from "@/components/ui/list-footer"
import { LoadFailed } from "@/components/ui/load-failed"
import { LoadMore } from "@/components/ui/load-more"
import { PillTabs } from "@/components/ui/pill-tabs"
import { SkeletonRows } from "@/components/ui/skeleton-rows"
import { ChatRoomsList } from "@/features/chats/components/chat-rooms-list"
import { TabHeader } from "@/features/navigation/components/tab-header"
import { cn } from "@/lib/utils"
import { ConversationRow } from "../components/conversations/conversation-row"
import { ConversationRowSkeleton } from "../components/conversations/conversation-row-skeleton"
import { ConversationSearch } from "../components/conversations/conversation-search"
import { MessageHitRow } from "../components/conversations/message-hit-row"
import { ShareAnonLinkSheet } from "../components/conversations/share-anon-link-sheet"
import { StreakIntroSheet } from "../components/conversations/streak-intro-sheet"
import { useMessagesScreen } from "../hooks/use-messages-screen"

export function MessagesScreen() {
  const screen = useMessagesScreen()
  const { feed, anonLink } = screen

  return (
    <>
      <TabHeader
        title={screen.title}
        right={
          screen.showShare ? (
            <IconButton
              icon={GhostIcon}
              label="Get anonymous messages"
              onClick={anonLink.onOpen}
              className={cn(anonLink.nudge && "motion-safe:animate-pulse")}
            />
          ) : null
        }
      />

      {screen.tabs ? (
        <PillTabs
          tabs={[
            { value: "dms", label: "DMs", icon: MessageCircleIcon },
            {
              value: "rooms",
              label: "Rooms",
              icon: MessagesSquareIcon,
              count: screen.tabs.unreadRooms,
            },
          ]}
          value={screen.tabs.value}
          onChange={screen.tabs.onChange}
        />
      ) : null}

      {screen.showRooms ? (
        <ChatRoomsList {...screen.rooms} />
      ) : screen.dmsEnabled === null ? (
        <>
          <ConversationSearch value={screen.query} onChange={screen.setQuery} />
          <SkeletonRows count={8} item={ConversationRowSkeleton} />
        </>
      ) : !screen.dmsEnabled ? (
        <EmptyState
          icon={GhostIcon}
          title="Messages aren't on yet"
          description="Direct messages are switched off right now. They'll show up here once they're turned on."
          className="py-24"
        />
      ) : (
        <>
          <ConversationSearch value={screen.query} onChange={screen.setQuery} />

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

              {feed.conversations.length === 0 && !screen.searching ? (
                <EmptyState
                  icon={GhostIcon}
                  title="No messages yet"
                  description={
                    screen.showShare
                      ? "Start a chat from someone’s profile, or share your link for anonymous messages."
                      : "Start a chat from someone’s profile."
                  }
                  className="py-24"
                  action={
                    screen.showShare ? (
                      <Button size="sm" onClick={anonLink.onOpen}>
                        <GhostIcon /> Share your link
                      </Button>
                    ) : undefined
                  }
                />
              ) : null}

              {/* Threads are matched by person; this section is the text inside them. */}
              {screen.matches.length > 0 ? (
                <div className="pt-2">
                  <p className="px-4 pb-1 text-xs font-bold tracking-wide text-muted-foreground uppercase sm:px-6">
                    Messages
                  </p>
                  {screen.matches.map((hit) => (
                    <MessageHitRow key={hit.message.id} hit={hit} />
                  ))}
                </div>
              ) : null}

              {screen.nothingFound ? (
                <EmptyState
                  icon={SearchXIcon}
                  title="Nothing found"
                  description="No person or message matches that."
                  className="py-24"
                />
              ) : null}

              <LoadMore onReach={feed.loadMore} disabled={feed.loadingMore} />
              <ListFooter
                loading={feed.loadingMore || screen.searchingMessages}
              />
            </>
          )}
        </>
      )}

      {screen.showShare ? <ShareAnonLinkSheet {...anonLink.sheet} /> : null}
      <StreakIntroSheet {...screen.streakIntro} />
    </>
  )
}

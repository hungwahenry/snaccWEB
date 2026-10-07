"use client"

import {
  GhostIcon,
  MessageCircleIcon,
  MessagesSquareIcon,
  SearchIcon,
  SearchXIcon,
} from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import { IconButton } from "@/components/ui/icon-button"
import { ListFooter } from "@/components/ui/list-footer"
import { LoadFailed } from "@/components/ui/load-failed"
import { LoadMore } from "@/components/ui/load-more"
import { PillTabs } from "@/components/ui/pill-tabs"
import { SkeletonRows } from "@/components/ui/skeleton-rows"
import { ChatRoomsList } from "@/features/chats/components/chat-rooms-list"
import { TabHeader } from "@/features/navigation/components/tab-header"
import { ConversationRow } from "../components/conversations/conversation-row"
import { ConversationRowSkeleton } from "../components/conversations/conversation-row-skeleton"
import { ConversationSearch } from "../components/conversations/conversation-search"
import { MessageHitRow } from "../components/conversations/message-hit-row"
import { StreakIntroSheet } from "../components/conversations/streak-intro-sheet"
import { useMessagesScreen } from "../hooks/use-messages-screen"

export function MessagesScreen() {
  const screen = useMessagesScreen()
  const { feed, search } = screen

  return (
    <>
      {search?.active ? (
        <ConversationSearch
          value={screen.query}
          onChange={screen.setQuery}
          onCancel={search.close}
        />
      ) : (
        <TabHeader
          title={screen.title}
          right={
            search ? (
              <IconButton
                icon={SearchIcon}
                label="Search messages"
                onClick={search.open}
              />
            ) : null
          }
        />
      )}

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
        <SkeletonRows count={8} item={ConversationRowSkeleton} />
      ) : !screen.dmsEnabled ? (
        <EmptyState
          icon={GhostIcon}
          title="Messages aren't on yet"
          description="Direct messages are switched off right now. They'll show up here once they're turned on."
          className="py-24"
        />
      ) : (
        <>
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
              {screen.showPeople ? (
                <p className="px-4 pt-2 pb-1 text-xs font-bold tracking-wide text-muted-foreground uppercase sm:px-6">
                  People
                </p>
              ) : null}

              {feed.conversations.map((conversation) => (
                <ConversationRow
                  key={conversation.id}
                  conversation={conversation}
                />
              ))}

              {feed.conversations.length === 0 && !screen.searching ? (
                <EmptyState
                  icon={MessageCircleIcon}
                  title="No messages yet"
                  description="Start a chat from someone’s profile."
                  className="py-24"
                />
              ) : null}

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

      <StreakIntroSheet {...screen.streakIntro} />
    </>
  )
}

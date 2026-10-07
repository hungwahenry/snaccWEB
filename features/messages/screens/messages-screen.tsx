"use client"

import {
  GhostIcon,
  MessageCircleIcon,
  SearchIcon,
  SearchXIcon,
} from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import { IconButton } from "@/components/ui/icon-button"
import { ListFooter } from "@/components/ui/list-footer"
import { LoadFailed } from "@/components/ui/load-failed"
import { LoadMore } from "@/components/ui/load-more"
import { SkeletonRows } from "@/components/ui/skeleton-rows"
import { ChatRoomRow } from "@/features/chats/components/chat-room-row"
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
  const roomsOnly = screen.dmsEnabled === false

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
          title="Messages"
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

      {screen.pinned.length > 0 ? (
        <div className="border-b border-border">
          {screen.pinned.map((room) => (
            <ChatRoomRow key={room.id} room={room} href={screen.hrefOf(room)} />
          ))}
        </div>
      ) : null}

      {screen.dmsEnabled === null || feed.loading ? (
        <SkeletonRows count={8} item={ConversationRowSkeleton} />
      ) : feed.failed && feed.conversations.length === 0 && !roomsOnly ? (
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

          {screen.entries.map((entry) =>
            entry.kind === "dm" ? (
              <ConversationRow
                key={entry.key}
                conversation={entry.conversation}
              />
            ) : (
              <ChatRoomRow
                key={entry.key}
                room={entry.room}
                href={screen.hrefOf(entry.room)}
              />
            )
          )}

          {screen.entries.length === 0 && !screen.searching ? (
            roomsOnly ? (
              screen.pinned.length === 0 && !screen.roomsLoading ? (
                <EmptyState
                  icon={GhostIcon}
                  title="Messages aren't on yet"
                  description="Direct messages are switched off right now. They'll show up here once they're turned on."
                  className="py-24"
                />
              ) : null
            ) : (
              <EmptyState
                icon={MessageCircleIcon}
                title="No messages yet"
                description="Start a chat from someone’s profile."
                className="py-24"
              />
            )
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

          {roomsOnly ? null : (
            <LoadMore onReach={feed.loadMore} disabled={feed.loadingMore} />
          )}
          <ListFooter loading={feed.loadingMore || screen.searchingMessages} />
        </>
      )}

      <StreakIntroSheet {...screen.streakIntro} />
    </>
  )
}

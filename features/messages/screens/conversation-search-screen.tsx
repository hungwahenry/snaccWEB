"use client"

import { SearchIcon, SearchXIcon } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import { LoadFailed } from "@/components/ui/load-failed"
import { SkeletonRows } from "@/components/ui/skeleton-rows"
import { ConversationSearch } from "../components/conversations/conversation-search"
import { MessageHitRow } from "../components/conversations/message-hit-row"
import { MessageHitRowSkeleton } from "../components/conversations/message-hit-row-skeleton"
import { useConversationSearchScreen } from "../hooks/use-conversation-search-screen"

export function ConversationSearchScreen({ id }: { id: string }) {
  const screen = useConversationSearchScreen(id)

  return (
    <>
      <ConversationSearch
        value={screen.query}
        placeholder="Search this chat"
        onChange={screen.onChange}
        onCancel={screen.onCancel}
      />

      {screen.idle ? (
        <EmptyState
          icon={SearchIcon}
          title="Search this chat"
          description="Find a message by any of its words."
          className="py-24"
        />
      ) : screen.searching ? (
        <SkeletonRows count={6} item={MessageHitRowSkeleton} />
      ) : screen.failed ? (
        <div className="py-16">
          <LoadFailed
            title="Could not search this chat"
            onRetry={screen.retry}
          />
        </div>
      ) : screen.nothingFound ? (
        <EmptyState
          icon={SearchXIcon}
          title="Nothing found"
          description="No message in this chat matches that."
          className="py-24"
        />
      ) : (
        screen.hits.map((hit) => (
          <MessageHitRow key={hit.message.id} hit={hit} replace />
        ))
      )}
    </>
  )
}

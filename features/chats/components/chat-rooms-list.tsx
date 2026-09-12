import { MessagesSquareIcon } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import { LoadFailed } from "@/components/ui/load-failed"
import { SkeletonRows } from "@/components/ui/skeleton-rows"
import type { ChatRoom } from "../types"
import { ChatRoomRow } from "./chat-room-row"
import { ChatRoomRowSkeleton } from "./chat-room-row-skeleton"

export function ChatRoomsList({
  rooms,
  loading,
  failed,
  onRetry,
  hrefOf,
}: {
  rooms: ChatRoom[]
  loading: boolean
  failed: boolean
  onRetry: () => void
  hrefOf: (room: ChatRoom) => string
}) {
  if (loading) return <SkeletonRows count={2} item={ChatRoomRowSkeleton} />

  if (failed && rooms.length === 0) {
    return (
      <div className="py-24">
        <LoadFailed title="Could not load rooms" onRetry={onRetry} />
      </div>
    )
  }

  if (rooms.length === 0) {
    return (
      <EmptyState
        icon={MessagesSquareIcon}
        title="No rooms yet"
        description="Your campus room and the room for everyone show up here once they're open."
        className="py-24"
      />
    )
  }

  return rooms.map((room) => (
    <ChatRoomRow key={room.id} room={room} href={hrefOf(room)} />
  ))
}
